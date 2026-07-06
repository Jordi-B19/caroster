import { errors } from "@strapi/utils";

export default async (policyContext, _config, { strapi }) => {
  const tripAlertId = policyContext.args?.id;
  const tripAlert = await strapi.entityService.findOne(
    "api::trip-alert.trip-alert",
    tripAlertId,
    {
      populate: {
        event: true,
        user: true,
      },
    }
  );

  if (!tripAlert) throw new errors.NotFoundError("tripAlert not found");

  const event = tripAlert.event;

  const user = policyContext.state.user;
  if (!user) throw new errors.ForbiddenError();
  else if (!tripAlert.user) return true;

  const admins = event.administrators?.split(/, ?/) || [];
  const isAdmin = [...admins, event.email].includes(user.email);

  // If remove self
  if (tripAlert.user.id == user.id) return true;
  else if (isAdmin) return true;
  else return false;
};
