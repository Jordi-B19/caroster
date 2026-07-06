import { factories } from "@strapi/strapi";
import pMap from "p-map";

const warnSeatAvailable = async ({ id, user, email }) => {
  strapi.log.info(`Seat available notification created for ${id}`);
};

const warnSeatUnavailableAndMoveToWaitingList = async ({ id, user, email }) => {
  strapi.log.info(`Seat unavailable notification created for ${id}`);
  await strapi.entityService.update("api::passenger.passenger", id, {
    data: {
      travel: null,
    },
  });
};

export default factories.createCoreService(
  "api::travel.travel",
  ({ strapi }) => ({
    checkOverflowOrUnderflow: async (travel) => {
      travel = await strapi.entityService.findOne(
        "api::travel.travel",
        travel.id,
        {
          populate: {
            passengers: true,
            event: {
              populate: {
                passengers: {
                  filters: { date: travel.departureDate, travel: null },
                  populate: "user",
                },
              },
            },
          },
        }
      );
      const passengers = travel.passengers;
      const event = travel.event;
      const waitingList = event.passengers;
      const seatsAvailable = travel.seats - passengers.length;
      if (seatsAvailable > 0) {
        await pMap(waitingList, warnSeatAvailable, { concurrency: 5 });
      } else if (seatsAvailable < 0) {
        const passengersToRemove = passengers.slice(travel.seats);
        await pMap(
          passengersToRemove,
          warnSeatUnavailableAndMoveToWaitingList,
          {
            concurrency: 5,
          }
        );
      }
    },
  })
);
