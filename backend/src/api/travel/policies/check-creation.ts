import { errors } from "@strapi/utils";

export default async (policyContext, config, { strapi }) => {
  const eventId = policyContext.args?.data?.event;
  const event = await strapi.entityService.findOne("api::event.event", eventId);

  if (!event) throw new errors.NotFoundError(`Event not found`);

  const user = policyContext.state.user;
  if (!user) {
    const email = policyContext.args?.data?.email;
    if (!email) throw new errors.ForbiddenError();
    let user = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { email },
    });
    const firstName = policyContext.args.data.firstname;
    const lastName = policyContext.args.data.lastname;
    const username = [firstName, lastName].filter(Boolean).join(" ");
    if (user) {
      user = await strapi.db.query("plugin::users-permissions.user").update({
        where: { id: user.id },
        data: {
          username,
          firstName,
          lastName,
        },
      });
    } else {
      user = await strapi.db.query("plugin::users-permissions.user").create({
        data: {
          username,
          firstName,
          lastName,
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
    policyContext.http.set("Authorization", `Bearer ${token}`);
    policyContext.args.data.user = user.id;
    policyContext.state.user = user;
  }
};
