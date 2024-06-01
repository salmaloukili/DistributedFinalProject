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
    image_url: faker.internet.url(),
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
    image_url: faker.internet.url(),
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
    image_url: faker.internet.url(),
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

const createVendor = (type: string) => {
  return {
    vendor_name: faker.company.name(),
    image_url: faker.internet.url(),
    type: type,
    // type: faker.helpers.arrayElement(["Venue", "Transport", "Catering"]),
  };
};


exports.populateVenueVendors = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {

    for (let i = 0; i < 3; i++) {
      // Create 3 vendors of type "Venue"
      const vendorDoc = base.vendorRef.doc();
      batch.set(vendorDoc, createVendor("Venue"));

      for (let j = 0; j < 4; j++) {
        // Each vendor has 4 venues
        const venueDoc = vendorDoc.collection("venues").doc();
        batch.set(venueDoc, createVenue());

        for (let k = 0; k < 3; k++) {
          // Each venue has 3 events
          const eventDoc = venueDoc.collection("events").doc();
          batch.set(eventDoc, createEvent("abc"));

          for (let l = 0; l < 3; l++) {
            // Each event has 3 tickets
            const ticketDoc = eventDoc.collection("tickets").doc();
            batch.set(ticketDoc, createTicket("abc"));
          }
        }
      }
    }

    await batch.commit();
    res.send("Database populated with fake data for venue vendors.");
  });

exports.populateCateringVendors = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    for (let i = 0; i < 3; i++) {
      // Create 3 vendors of type "Catering"
      const vendorDoc = base.vendorRef.doc();
      batch.set(vendorDoc, createVendor("Catering"));
      for (let j = 0; j < 3; j++) {
        // Each vendor has 3 menus
        const menuDoc = vendorDoc.collection("menus").doc();
        batch.set(menuDoc, createMenu());
        for (let k = 0; k < 3; k++) {
          // Each menu has 3 meals
          const mealDoc = menuDoc.collection("meals").doc();
          batch.set(mealDoc, createMeal("abc"));
        }
      }
    }
    await batch.commit();
    res.send("Database populated with fake data for catering vendors.");
  });


exports.populateTransportVendors = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    for (let i = 0; i < 3; i++) {
      // Create 3 vendors of type "Transport"
      const vendorDoc = base.vendorRef.doc();
      batch.set(vendorDoc, createVendor("Transport"));

      for (let j = 0; j < 3; j++) {
        // Each vendor has 3 buses
        const busDoc = vendorDoc.collection("buses").doc();
        batch.set(busDoc, createBus());

        for (let k = 0; k < 3; k++) {
          // Each bus has 3 schedules
          const scheduleDoc = busDoc.collection("schedules").doc();
          batch.set(scheduleDoc, createSchedule("abc"));

          for (let l = 0; l < 3; l++) {
            // Each schedule has 3 seats
            const seatDoc = scheduleDoc.collection("seats").doc();
            batch.set(seatDoc, createSeat("abc"));
          }
        }
      }
    }
    await batch.commit();
    res.send("Database populated with fake data for transport vendors.");
  });

exports.populateAllVendors = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    //VenueVendors
    for (let i = 0; i < 3; i++) {
      // Create 3 vendors of type "Venue"
      const vendorDoc = base.vendorRef.doc();
      batch.set(vendorDoc, createVendor("Venue"));

      for (let j = 0; j < 4; j++) {
        // Each vendor has 4 venues
        const venueDoc = vendorDoc.collection("venues").doc();
        batch.set(venueDoc, createVenue());

        for (let k = 0; k < 3; k++) {
          // Each venue has 3 events
          const eventDoc = venueDoc.collection("events").doc();
          batch.set(eventDoc, createEvent("abc"));

          for (let l = 0; l < 3; l++) {
            // Each event has 3 tickets
            const ticketDoc = eventDoc.collection("tickets").doc();
            batch.set(ticketDoc, createTicket("abc"));
          }
        }
      }
    }

    //Catering vendors
    for (let i = 0; i < 3; i++) {
      // Create 3 vendors of type "Catering"
      const vendorDoc = base.vendorRef.doc();
      batch.set(vendorDoc, createVendor("Catering"));
      for (let j = 0; j < 3; j++) {
        // Each vendor has 3 menus
        const menuDoc = vendorDoc.collection("menus").doc();
        batch.set(menuDoc, createMenu());
        for (let k = 0; k < 3; k++) {
          // Each menu has 3 meals
          const mealDoc = menuDoc.collection("meals").doc();
          batch.set(mealDoc, createMeal("abc"));
        }
      }
    }

    //Transport vendors
    for (let i = 0; i < 3; i++) {
      // Create 3 vendors of type "Transport"
      const vendorDoc = base.vendorRef.doc();
      batch.set(vendorDoc, createVendor("Transport"));

      for (let j = 0; j < 3; j++) {
        // Each vendor has 3 buses
        const busDoc = vendorDoc.collection("buses").doc();
        batch.set(busDoc, createBus());

        for (let k = 0; k < 3; k++) {
          // Each bus has 3 schedules
          const scheduleDoc = busDoc.collection("schedules").doc();
          batch.set(scheduleDoc, createSchedule("abc"));

          for (let l = 0; l < 3; l++) {
            // Each schedule has 3 seats
            const seatDoc = scheduleDoc.collection("seats").doc();
            batch.set(seatDoc, createSeat("abc"));
          }
        }
      }
    }



    await batch.commit();
    res.send("Database populated with fake data for ALL vendors.");
  });
  

