import { onCall } from "firebase-functions/v2/https";
import * as base from "../firebase";
import { getRef } from "../firebase";
import sources from "../orbit/sources";
import { ServerError } from "@orbit/jsonapi";

// Cloud Function to get all events
exports.getEvents = onCall({ region: "europe-west1" }, async (request) => {
  const querySnapshot = await base.db.collectionGroup("events").get();
  const vendors = await base.db
    .collection("vendors")
    .where("type", "==", "Venue")
    .get();

  const data = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ref: doc.ref.path,
      ...doc.data(),
      vendor: vendors.docs
        .find((vn) => vn.id === doc.ref.path.split("/").at(1))
        ?.data(),
    };
  });
  return data;
});

//Cloud Function to get transportation schedules for a specific date
exports.getTransportation = onCall(
  { region: "europe-west1" },
  async (request) => {
    const querySnapshot = await base.db.collectionGroup("schedules").get();
    const buses = await base.db.collectionGroup("buses").get();
    const vendors = await base.db
      .collection("vendors")
      .where("type", "==", "Transport")
      .get();

    const data = querySnapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        ref: doc.ref.path,
        ...docData,
        bus: buses.docs
          .find(
            (bus) =>
              bus.ref.path.split("/").at(1) === doc.ref.path.split("/").at(1)
          )
          ?.data(),
        vendor: vendors.docs
          .find((vn) => vn.id === doc.ref.path.split("/").at(1))
          ?.data(),
      };
    });
    return data;
  }
);

exports.getFood = onCall({ region: "europe-west1" }, async (request) => {
  const querySnapshot = await base.db.collectionGroup("menus").get();
  const vendors = await base.db
    .collection("vendors")
    .where("type", "==", "Catering")
    .get();

  const data = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ref: doc.ref.path,
      ...doc.data(),
      vendor: vendors.docs
        .find((vn) => vn.id === doc.ref.path.split("/").at(1))
        ?.data(),
    };
  });
  return data;
});

exports.reserve = onCall({ region: "europe-west1" }, async (request) => {
  const eventVendor = await getRef("vendors")
    .doc(request.data.event.ref.split("/")[1])
    .get();

  const correctVendor = sources.venues.find((v) => v.name === eventVendor.id);

  if (!correctVendor) {
    return "Error";
  }

  const dt = new Date();
  const newTicket = {
    type: "Ticket", // Ensure the type matches your schema
    attributes: {
      sold_date: dt, // Set current date for sold_date
      status: "reserved",
      price: request.data.event.price,
      user_id: request.auth?.uid,
      event_id: parseInt(request.data.event.id, 10),
      removed: false, // Assuming this field is nullable and not yet removed
    },
  };
  let response;
  try {
    response = (await correctVendor.update((t) =>
      t.addRecord(newTicket)
    )) as any;
  } catch (error) {
    const e = error as ServerError;
    console.log((e.data as any).errors?.at(0)); // Be careful here, there might not be errors in the data.
    console.log((e.data as any).errors?.at(0)?.title); // Message might not exist.
  }
  // TODO: ADD the data to firebase
  // TODO: Do all other vendors.
  // TODO: Purchases
  // TODO: Make sure salma gets the errors so she can display them.
  // TODO: Test for errors (full venue), disconnectedvendor, etc.
  return response;
});
