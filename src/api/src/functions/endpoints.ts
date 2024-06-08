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
  const eventVendor = await getRef("vendors")
    .doc(request.data.event.ref.split("/")[1])
    .get();
  
  // const correctVendor = sources.venues[0];
  // correctVendor.update((t)=> t.addRecord)
});
