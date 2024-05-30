import * as functions from "firebase-functions";
import { faker } from "@faker-js/faker";
import db from "../firebase";

const batch = db.batch();

const menuRef = db.collection("menus");
const mealRef = db.collection("meals");

const busRef = db.collection("buses");
const scheduleRef = db.collection("schedules");
const seatRef = db.collection("seats");

const venueRef = db.collection("venues");
const eventRef = db.collection("events");
const ticketRef = db.collection("tickets");

const createMenu = () => {
  return {
    limit: faker.datatype.number({ min: 30, max: 60 }),
    food: faker.company.catchPhrase(),
    drink: faker.company.catchPhrase(),
    price: parseFloat(faker.commerce.price(20, 200, 2)),
  };
};

const createMeal = (menuId: string) => {
  return {
    customer_id: faker.datatype.uuid(),
    menu_id: menuId,
    meal_date: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
    status: faker.helpers.arrayElement(["reserved", "bought"]),
  };
};

const createVenue = () => {
  return {
    name: faker.company.name(),
    location: faker.address.streetAddress(),
    capacity: faker.datatype.number({ min: 50, max: 500 }),
  };
};

const createEvent = (venueId: string) => {
  return {
    venue_id: venueId,
    max_price: faker.datatype.number({ min: 50, max: 100 }),
    name: faker.company.catchPhrase(),
    date: faker.date.between(faker.date.recent(30), faker.date.soon(30)),
  };
};

const createTicket = (eventId: string) => {
  return {
    user_id: faker.datatype.uuid(),
    event_id: eventId,
    price: parseFloat(faker.commerce.price(20, 200, 2)),
    sold_date: faker.date.between(faker.date.past(1), new Date()),
    status: faker.helpers.arrayElement(["reserved", "bought"]),
  };
};

const createBus = () => {
  return {
    model: faker.company.name(),
    capacity: faker.datatype.number({ min: 30, max: 60 }),
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
  };
};

const createSeat = (scheduleId: string) => {
  return {
    passenger_id: faker.datatype.uuid(),
    schedule_id: scheduleId,
    sold_date: faker.date.between(faker.date.past(1), new Date()),
    status: faker.helpers.arrayElement(["reserved", "bought"]),
  };
};

exports.buses = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    for (let i = 0; i < faker.datatype.number({ min: 2, max: 4 }); i++) {
      const busDoc = busRef.doc();
      batch.set(busDoc, createBus());

      for (let j = 0; j < faker.datatype.number({ min: 2, max: 8 }); j++) {
        const scheduleDoc = scheduleRef.doc();
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
          const seatDoc = seatRef.doc();
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
      const venueDoc = venueRef.doc();
      batch.set(venueDoc, createVenue());

      for (let j = 0; j < faker.datatype.number({ min: 2, max: 8 }); j++) {
        const eventDoc = eventRef.doc();
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
          const ticketDoc = ticketRef.doc();
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
      const menuDoc = menuRef.doc();
      batch.set(menuDoc, createMenu());

      for (let j = 0; j < faker.datatype.number({ min: 0, max: 10 }); j++) {
        const mealDoc = mealRef.doc();
        batch.set(mealDoc, createMeal(menuDoc.id));
      }
    }

    await batch.commit();
    res.send("Database populated with fake data.");
  });
