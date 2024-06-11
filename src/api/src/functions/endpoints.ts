import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";
import * as base from "../firebase";
import { getRef } from "../firebase";
import sources from "../orbit/sources";

// Cloud Function to get all events
exports.getEvents = onCall({ region: "europe-west1" }, async (request) => {
  const querySnapshot = await base.db.collectionGroup("events").get();
  const data = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ref: doc.ref.path, ...doc.data() };
  });
  return data;
});

//Cloud Function to get transportation schedules for a specific date
exports.getTransportation = onCall(
  { region: "europe-west1" },
  async (request) => {
    const querySnapshot = await base.db.collectionGroup("schedules").get();
    const data = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ref: doc.ref.path, ...doc.data() };
    });
    return data;
  }
);

exports.getFood = onCall({ region: "europe-west1" }, async (request) => {
  const querySnapshot = await base.db.collectionGroup("menus").get();
  const data = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ref: doc.ref.path, data: { ...doc.data() } };
  });
  return data;
});

exports.reserve = onCall({ region: "europe-west1" }, async (request) => {
  console.log(request.data)
  console.log(request.data.event.ref.split("/"))
  console.log(request.data.event.ref.split("/")[1]);
  console.log(sources.venues[0])
  const eventVendor = await getRef("vendors")
    .doc(request.data.event.ref.split("/")[1])
    .get();
    console.log(eventVendor)

  console.log("price is: ")
  console.log(request.data.event.max_price)
  
  const correctVendor = sources.venues[0];

  const newTicket = {
    type: "Ticket", // Ensure the type matches your schema
    attributes: {
      price: request.data.event.max_price,
      sold_date: new Date().toISOString(), // Set current date for sold_date
      status: "reserved",
      user_id: "userId", // Use the extracted user ID
      event_id: parseInt(request.data.event.id, 10),
      created_at: new Date().toISOString(), // Set created_at to current date
      modified_at: new Date().toISOString(), // Set modified_at to current date
      removed: "null", // Assuming this field is nullable and not yet removed
    },
    relationships: {
      event: { data: { type: "event", id: request.data.event.id } },
    },
  };
  console.log(newTicket);

  correctVendor.update((t)=> t.addRecord(newTicket))
});
