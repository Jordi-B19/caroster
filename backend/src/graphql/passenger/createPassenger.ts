import pMap from "p-map";
import moment from "moment";

const createPassenger = {
  description: "Create a passenger",
  async resolve(_root, args) {
    const { data: passengerInput } = args;
    const {
      user: userId,
      event: eventId,
      email,
      travel: travelId,
    } = passengerInput;

    //Avoid duplicity when the connected users add themself
    if (userId) {
      const filters = [
        userId && { user: { id: userId } },
        email && { email },
      ].filter(Boolean);
      let travel;
      let date = passengerInput.date;
      if (travelId) {
        travel = await strapi.entityService.findOne(
          "api::travel.travel",
          travelId
        );
        if (!travel) throw new Error("Travel not found");
        date = travel.departureDate;
      }
      const userPassengersInEvent = (await strapi.entityService.findMany(
        "api::passenger.passenger",
        {
          filters: {
            event: { id: eventId },
            $or: filters,
            date,
          },
        }
      )) as { id: string }[];

      // Delete existing passenger linked to the user in targeted event
      await pMap(
        userPassengersInEvent,
        async (passenger) =>
          strapi.entityService.delete("api::passenger.passenger", passenger.id),
        { concurrency: 5 }
      );
    }

    const createdPassenger = await strapi.entityService.create(
      "api::passenger.passenger",
      {
        data: passengerInput,
        populate: {
          event: true,
          user: true,
          travel: {
            populate: {
              user: true,
            },
          },
        },
      }
    );

    const travel = createdPassenger.travel;
    if ((createdPassenger.user || createdPassenger.email) && travel) {
      const driver = travel.user || { email: travel.email };
      const date = travel.departureDate
        ? moment(travel.departureDate)
            .locale(
              createdPassenger.user?.lang || createdPassenger.event.lang || "en"
            )
            .format("dddd LL")
        : "";
      const datetime = `${date} ${travel.departureTime || ""}`;
      try {
        const vehicleName =
          travel.firstname && travel.lastname
            ? `${travel.firstname} ${travel.lastname[0]}.`
            : travel.vehicleName;
        if (createdPassenger.user)
          await strapi.entityService.create("api::notification.notification", {
            data: {
              type: "ContactTripCreator",
              event: createdPassenger.event.id,
              user: createdPassenger.user.id,
              // @ts-expect-error
              payload: { travel, driver, datetime, vehicleName },
            },
          });
        else if (createdPassenger.email)
          await strapi
            .service("api::email.email")
            .sendEmailNotif(
              createdPassenger.email,
              "ContactTripCreator",
              createdPassenger.event.lang || "en",
              {
                event: createdPassenger.event,
                travel,
                driver,
                datetime,
                vehicleName,
              }
            );
      } catch (error) {
        console.error(error);
      }
    }

    const { toEntityResponse } = strapi
      .plugin("graphql")
      .service("format").returnTypes;

    return toEntityResponse(createdPassenger, {
      args,
      resourceUID: "api::passenger.passenger",
    });
  },
};

export default createPassenger;
