import * as functions from "firebase-functions";
import { faker } from "@faker-js/faker";
import * as base from "../firebase";

const batch = base.db.batch();


const createMenu = () => {
  return {
    limit: faker.datatype.number({ min: 30, max: 60 }),
    food: faker.company.catchPhrase(),
    drink: faker.company.catchPhrase(),
    description: faker.company.catchPhrase(),
    price: parseFloat(faker.commerce.price(20, 200, 2)),
    created_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
    modified_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
  };
};

const createMeal = (menuId: string) => {
  return {
    customer_id: faker.datatype.uuid(),
    menu_id: menuId,
    meal_date: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
    status: faker.helpers.arrayElement(["reserved", "bought"]),
    created_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
    modified_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
  };
};

const createVenue = () => {
  return {
    name: faker.company.name(),
    location: faker.address.streetAddress(),
    capacity: faker.datatype.number({ min: 50, max: 500 }),
    created_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
    modified_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
  };
};

const createEvent = (venueId: string) => {
  return {
    venue_id: venueId,
    max_price: faker.datatype.number({ min: 50, max: 100 }),
    name: faker.company.catchPhrase(),
    genre: faker.company.catchPhrase(),
    date: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
    created_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
    modified_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
  };
};

const createTicket = (eventId: string) => {
  return {
    event_id: eventId,
    user_id: faker.datatype.uuid(),
    price: parseFloat(faker.commerce.price(20, 200, 2)),
    sold_date: faker.date.between(faker.date.past(1), new Date()),
    status: faker.helpers.arrayElement(["reserved", "bought"]),
    created_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
    modified_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
  };
};

const createBus = () => {
  return {
    model: faker.company.name(),
    capacity: faker.datatype.number({ min: 30, max: 60 }),
    created_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
    modified_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
  };
};

const createSchedule = (busId: string) => {
  return {
    bus_id: busId,
    price: parseFloat(faker.commerce.price(20, 200, 2)),
    departure_date: faker.date.between(
      faker.date.recent(30),
      faker.date.soon(30)
    ),
    origin: faker.address.city(),
    created_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
    modified_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
  };
};

const createSeat = (scheduleId: string) => {
  return {
    passenger_id: faker.datatype.uuid(),
    schedule_id: scheduleId,
    sold_date: faker.date.between(faker.date.past(1), new Date()),
    status: faker.helpers.arrayElement(["reserved", "bought"]),
    created_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
    modified_at: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
  };
};

const createVenueVendor = () => {
  return {
    venue_vendor_name: faker.company.name(),
  };
};

const createCateringVendor = () => {
  return {
    catering_vendor_name: faker.company.name(),
  };
};

const createTransportVendor = () => {
  return {
    transport_vendor_name: faker.company.name(),
  };
};

exports.populateVenueVendors = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    for (let i = 0; i < faker.datatype.number({ min: 2, max: 4 }); i++) {
      const venueVendorDoc = base.venueVendorRef.doc();
      batch.set(venueVendorDoc, createVenueVendor());

      for (let j = 0; j < faker.datatype.number({ min: 4, max: 6 }); j++) {
        const venueDoc = venueVendorDoc.collection('venues').doc()
        batch.set(venueDoc, createVenue());

        for (let k = 0; k < faker.datatype.number({ min: 4, max: 6 }); k++) {
          const eventDoc = venueDoc.collection("events").doc();
          batch.set(eventDoc, createEvent(venueDoc.id));

          for (let l = 0; l < faker.datatype.number({ min: 5, max: 10 }); l++) {
            const ticketDoc = eventDoc.collection("events").doc();
            batch.set(ticketDoc, createTicket(eventDoc.id));
          }
        }
      }
    }

    await batch.commit();
    res.send("Database populated with fake data.");
  });


exports.buses = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    for (let i = 0; i < faker.datatype.number({ min: 2, max: 4 }); i++) {
      const busDoc = base.busRef.doc();
      batch.set(busDoc, createBus());

      for (let j = 0; j < faker.datatype.number({ min: 2, max: 8 }); j++) {
        const scheduleDoc = base.scheduleRef.doc();
        batch.set(scheduleDoc, createSchedule(busDoc.id));

        for (
          let k = 0;
          k <
          faker.datatype.number({
            min: 0,
            max: Math.round(100 / 2),
          });
          k++
        ) {
          const seatDoc = base.seatRef.doc();
          batch.set(seatDoc, createSeat(scheduleDoc.id));
        }
      }
    }

    await batch.commit();
    res.send("Database populated with fake data.");
  });

exports.venues = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    for (let i = 0; i < faker.datatype.number({ min: 2, max: 4 }); i++) {
      const venueDoc = base.venueRef.doc();
      batch.set(venueDoc, createVenue());

      for (let j = 0; j < faker.datatype.number({ min: 2, max: 8 }); j++) {
        const eventDoc = base.eventRef.doc();
        batch.set(eventDoc, createEvent(venueDoc.id));

        for (
          let k = 0;
          k <
          faker.datatype.number({
            min: 0,
            max: Math.round(100 / 2),
          });
          k++
        ) {
          const ticketDoc = base.ticketRef.doc();
          batch.set(ticketDoc, createTicket(eventDoc.id));
        }
      }
    }

    await batch.commit();
    res.send("Database populated with fake data.");
  });

exports.catering = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    // Create menus and meals
    for (let i = 0; i < faker.datatype.number({ min: 4, max: 8 }); i++) {
      const menuDoc = base.menuRef.doc();
      batch.set(menuDoc, createMenu());

      for (let j = 0; j < faker.datatype.number({ min: 0, max: 10 }); j++) {
        const mealDoc = base.mealRef.doc();
        batch.set(mealDoc, createMeal(menuDoc.id));
      }
    }

    await batch.commit();
    res.send("Database populated with fake data.");
  });
