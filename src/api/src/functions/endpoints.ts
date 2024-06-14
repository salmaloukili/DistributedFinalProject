import { onCall } from "firebase-functions/v2/https";
import * as base from "../firebase";
import { db, getRef } from "../firebase";
import sources from "../orbit/sources";

// Cloud Function to get all events
exports.getEvents = onCall({ region: "europe-west1" }, async (request) => {
  const querySnapshot = await base.db.collectionGroup("events").get();
  const vendors = await base.db
    .collection("vendors")
    .where("type", "==", "Venue")
    .get();
  const venues = await base.db.collectionGroup("venues").get();

  const data = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ref: doc.ref.path,
      ...doc.data(),
      vendor: vendors.docs
        .find((vn) => vn.id === doc.ref.path.split("/").at(1))
        ?.data(),
      venue: venues.docs
        .find(
          (ve) => ve.ref.path.split("/").at(1) === doc.ref.path.split("/").at(1)
        )
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

exports.getAllUsers = onCall({ region: "europe-west1" }, async (request) => {
  if (
    request.auth?.uid &&
    (await base.auth.getUser(request.auth.uid)).customClaims?.role === "admin"
  ) {
    const allUsers: any = [];
    const listAllUsers = async (nextPageToken?: string) => {
      const res = await base.auth.listUsers(1000, nextPageToken);
      allUsers.push(...res.users);
      if (res.pageToken) {
        await listAllUsers(res.pageToken);
      }
    };

    await listAllUsers();
    return allUsers;
  }
  return "Authentication Error";
});

exports.reserve = onCall({ region: "europe-west1" }, async (request) => {
  const dt = new Date();

  // Helper function to fetch vendor data
  const fetchVendor = async (ref: any) => {
    const id = ref.split("/")[1];
    return await getRef("vendors").doc(id).get();
  };

  // Fetch all vendors
  const [eventVendor, transportVendor, cateringVendor] = await Promise.all([
    fetchVendor(request.data.event.ref),
    fetchVendor(request.data.transportation.ref),
    fetchVendor(request.data.food.ref),
  ]);

  // Validate vendors
  const correctVenueVendor = sources.venues.find(
    (v) => v.name === eventVendor.id
  );
  const correctTransportVendor = sources.transport.find(
    (v) => v.name === transportVendor.id
  );
  const correctCateringVendor = sources.catering.find(
    (v) => v.name === cateringVendor.id
  );

  if (
    !correctVenueVendor ||
    !correctTransportVendor ||
    !correctCateringVendor
  ) {
    return {
      result: {
        valid: false,
        message: "Error: One or more vendors are invalid.",
      },
    };
  }

  let ticketResponse: any;
  let seatResponse: any;
  let mealResponse: any;

  try {
    ticketResponse = await correctVenueVendor.update((t: any) =>
      t.addRecord({
        type: "Ticket",
        attributes: {
          sold_date: dt,
          status: "reserved",
          user_id: request.auth?.uid,
          event_id: parseInt(request.data.event.id, 10),
          removed: false,
        },
      })
    );

    seatResponse = await correctTransportVendor.update((t: any) =>
      t.addRecord({
        type: "Seat",
        attributes: {
          sold_date: dt,
          status: "reserved",
          user_id: request.auth?.uid,
          schedule_id: parseInt(request.data.transportation.id, 10),
          removed: false,
        },
      })
    );

    mealResponse = await correctCateringVendor.update((t: any) =>
      t.addRecord({
        type: "Meal",
        attributes: {
          meal_date: dt,
          status: "reserved",
          user_id: request.auth?.uid,
          menu_id: parseInt(request.data.food.id, 10),
          removed: false,
        },
      })
    );
  } catch (error) {
    console.error("Error adding records:", error);

    // Rollback added records
    try {
      correctVenueVendor.update((t: any) =>
        t.removeRecord({ type: "Ticket", id: ticketResponse.id })
      );
    } catch (rollbackError) {
      console.error("Error rolling back record:", rollbackError);
    }
    try {
      correctCateringVendor.update((t: any) =>
        t.removeRecord({ type: "Meal", id: mealResponse.id })
      );
    } catch (rollbackError) {
      console.error("Error rolling back record:", rollbackError);
    }
    try {
      correctTransportVendor.update((t: any) =>
        t.removeRecord({ type: "Seat", id: seatResponse.id })
      );
    } catch (rollbackError) {
      console.error("Error rolling back record:", rollbackError);
    }

    return {
      result: {
        valid: false,
        message: "asjnkdjsanksankas",
      },
    };
  }

  const ticketDB = db
    .doc(request.data.event.ref)
    .collection("tickets")
    .doc(ticketResponse.id);
  ticketDB.set({
    id: ticketResponse.id,
    ...ticketResponse.attributes,
  });
  const seatDB = db
    .doc(request.data.transportation.ref)
    .collection("seats")
    .doc(seatResponse.id);
  seatDB.set({
    id: seatResponse.id,
    ...seatResponse.attributes,
  });
  const mealDB = db
    .doc(request.data.food.ref)
    .collection("meals")
    .doc(mealResponse.id);
  mealDB.set({
    id: mealResponse.id,
    ...mealResponse.attributes,
  });
  const purchase = db.collection("purchases").doc();
  const response = {
    id: purchase.path,
    user_id: ticketResponse.attributes.user_id,
    status: "reserved",
    ticket: {
      id: ticketResponse.id,
      ref: ticketDB.path,
      ...ticketResponse.attributes,
    },
    meal: {
      id: mealResponse.id,
      ref: mealDB.path,
      ...mealResponse.attributes,
    },
    seat: {
      id: seatResponse.id,
      ref: seatDB.path,
      ...seatResponse.attributes,
    },
    result: {
      valid: true,
      message:
        ticketResponse.attributes.price === request.data.event.price
          ? "Success"
          : "WARNING: Price changed.",
    },
  };
  purchase.set(response);
  console.log(response);
  return response;
});

exports.getPurchases = onCall({ region: "europe-west1" }, async (request) => {
  const querySnapshot = await base.db
    .collection("purchases")
    .where("user_id", "==", request.auth?.uid)
    .where("status", "==", "bought")
    .get();

  console.log(querySnapshot.docs.map((e) => e.data()));
});

// TODauO: ADD the data to firebase
// TODO: Purchases
// TODO: Make sure salma gets the errors so she can display them.
// TODO: Test for errors (full venue), disconnectedvendor, etc.
