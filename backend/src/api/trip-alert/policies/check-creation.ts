import { errors } from "@strapi/utils";

export default async (policyContext, _config, { strapi }) => {
  const user = policyContext.state.user;
  const eventId = policyContext.args?.data?.event;

  if (!eventId) throw new errors.ValidationError(`No event ID provided`);
  const event = await strapi.entityService.findOne("api::event.event", eventId);
  if (!event) throw new errors.NotFoundError(`Event not found`);

  const administrators = event.administrators?.split(/, ?/) || [];
  const isEventAdmin = [...administrators, event.email].includes(user?.email);
  if (!isEventAdmin) {
    if (user) policyContext.args.data.user = user.id;
    else {
      const email = policyContext.args.data.email;
      let user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email },
        });
      if (!user) {
        user = await strapi.db.query("plugin::users-permissions.user").create({
          data: {
            email,
            lang: "fr",
            confirmed: true,
            role: 1,
          },
        });
      }
      const token = await strapi.services[
        "plugin::users-permissions.user"
      ].magicLink.generateMagicToken(email, "fr", true);
      policyContext.res.headers.authorization = `Bearer ${token}`;
      policyContext.args.data.user = user.id;
      policyContext.state.user = user;
    }
  }
};
