export default {
  async beforeCreate(event) {
    event.state.isAdmin = event.params.data.isAdmin;
  },
  async afterCreate({ params, state }) {
    if (params.data.travel) {
      const travel = await strapi.entityService.findOne(
        "api::travel.travel",
        params.data.travel,
        {
          populate: ["user", "event"],
        }
      );
      if (travel)
        travel.user
          ? strapi.entityService.create("api::notification.notification", {
              data: {
                type: "NewPassengerInYourTrip",
                event: params.data.event,
                user: travel.user?.id,
              },
            })
          : strapi
              .service("api::email.email")
              .sendEmailNotif(
                travel.email,
                "NewPassengerInYourTrip",
                travel.event.lang || "en"
              );
      if (travel) params.data.date = travel.departureDate;
      if (travel && state.isAdmin) {
        const vehicleName =
          travel.firstname && travel.lastname
            ? `${travel.firstname} ${travel.lastname[0]}.`
            : travel.vehicleName;
        if (params.data.user)
          strapi.entityService.create("api::notification.notification", {
            data: {
              type: "AssignedByAdmin",
              event: params.data.event,
              user: params.data.user,
              // @ts-expect-error
              payload: { travel, vehicleName },
            },
          });
        else if (params.data.email)
          strapi
            .service("api::email.email")
            .sendEmailNotif(
              params.data.email,
              "AssignedByAdmin",
              travel.event.lang || "en"
            );
      }
    }
  },
};
