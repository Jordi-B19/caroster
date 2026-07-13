export default {
  routes: [
    {
      method: "GET",
      path: "/event/:id/magic-link",
      handler: "event.getMagicLink",
      config: {
        policies: [],
      },
    },
  ],
};
