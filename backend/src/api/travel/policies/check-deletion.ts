import { errors } from "@strapi/utils";
import moment from "moment";

export default async (policyContext, config, { strapi }) => {
  const travelId = policyContext.args?.id;
  const travel = await strapi.entityService.findOne(
    "api::travel.travel",
    travelId,
    {
      populate: ["event", "user"],
    }
  );

  if (!travel) throw new errors.NotFoundError(`Travel not found`);

  const event = travel.event;

  const user = policyContext.state.user;
  if (!user) throw new errors.ForbiddenError();

  const admins = event.administrators?.split(/, ?/) || [];
  const isAdmin = [...admins, event.email].includes(user.email);

  if (isAdmin) {
    const vehicleName =
      travel.firstname && travel.lastname
        ? `${travel.firstname} ${travel.lastname[0]}.`
        : travel.vehicleName;
    const date = moment(travel.departureDate).format("YYYY-MM-DD");
    if (travel.user)
      await strapi.entityService.create("api::notification.notification", {
        data: {
          type: "DeletedYourTrip",
          event,
          user: travel.user,
          payload: { travel, vehicleName, date },
        },
      });
    else if (travel.email)
      await strapi
        .service("api::email.email")
        .sendEmailNotif(travel.email, "DeletedYourTrip", event.lang, {
          travel,
          vehicleName,
          date,
          event,
        });
    return true;
  } else if (travel.user?.email === user.email) return true;
  else return false;
};
