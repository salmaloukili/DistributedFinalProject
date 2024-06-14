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

// exports.reserve = onCall({ region: "europe-west1" }, async (request) => {
//   const eventVendor = await getRef("vendors")
//     .doc(request.data.event.ref.split("/")[1])
//     .get();
//   const transportVendor = await getRef("vendors")
//     .doc(request.data.transportation.ref.split("/")[1])
//     .get();
//   const cateringVendor = await getRef("vendors")
//     .doc(request.data.food.ref.split("/")[1])
//     .get();

//   console.log(request.data);

//   const correctVenueVendor = sources.venues.find(
//     (v) => v.name === eventVendor.id
//   );
//   console.log("vendor is: ");
//   console.log(correctVenueVendor);

//   if (!correctVenueVendor) {
//     return "Error";
//   }

//   const dt = new Date();
//   const newTicket = {
//     type: "Ticket", // Ensure the type matches your schema
//     attributes: {
//       sold_date: dt, // Set current date for sold_date
//       status: "reserved",
//       // price: request.data.event.max_price,
//       user_id: `${request.auth?.uid}-${Date.now()}`,
//       event_id: parseInt(request.data.event.id, 10),
//       removed: false,
//     },
//   };
//   let response1;
//   try {
//     response1 = await correctVenueVendor.update((t) => t.addRecord(newTicket));

//     console.log("response returned");
//     console.log(response1);
//   } catch (error) {
//     const e = error as ServerError;
//     console.log((e.data as any).errors?.at(0)); // Be careful here, there might not be errors in the data.
//     console.log((e.data as any).errors?.at(0)?.title); // Message might not exist.
//   }

//   const correctTransportVendor = sources.transport.find(
//     (v) => v.name === transportVendor.id
//   );
//   console.log("transport vendor is: ");
//   console.log(correctTransportVendor);

//   if (!correctTransportVendor) {
//     return "Error";
//   }

//   console.log("transport vendor exists");

//   const newSeat = {
//     type: "Seat", // Ensure the type matches your schema
//     attributes: {
//       sold_date: dt, // Set current date for sold_date
//       status: "reserved",
//       // price: request.data.event.max_price,
//       user_id: `${request.auth?.uid}-${Date.now()}`,
//       schedule_id: parseInt(request.data.transportation.id, 10),
//       removed: false,
//     },
//   };

//   let response2;
//   try {
//     response2 = await correctTransportVendor.update((t) =>
//       t.addRecord(newSeat)
//     );
//     console.log("response returned from transport");
//     console.log(response2);
//   } catch (error) {
//     const e = error as ServerError;
//     console.log((e.data as any).errors?.at(0)); // Be careful here, there might not be errors in the data.
//     console.log((e.data as any).errors?.at(0)?.title); // Message might not exist.
//   }

//   const correctCateringVendor = sources.catering.find(
//     (v) => v.name === cateringVendor.id
//   );
//   console.log("catering vendor is: ");
//   console.log(correctCateringVendor);

//   if (!correctCateringVendor) {
//     return "Error";
//   } 
//   console.log("caterer exists")

//   const newMeal = {
//     type: "Meal", // Ensure the type matches your schema
//     attributes: {
//       meal_date: dt, // Set current date for sold_date
//       status: "reserved",
//       // price: request.data.event.max_price,
//       user_id: `${request.auth?.uid}-${Date.now()}`,
//       menu_id: parseInt(request.data.food.id, 10),
//       removed: false,
//     },
//   };

//   let response3;
//   try {
//     response3 = await correctCateringVendor.update((t) => t.addRecord(newMeal));
//     console.log("response returned from catering");
//     console.log(response3);
//   } catch (error) {
//     const e = error as ServerError;
//     console.log(e)
//     console.log((e.data as any).errors?.at(0)); // Be careful here, there might not be errors in the data.
//     console.log((e.data as any).errors?.at(0)?.title); // Message might not exist.
//   }

exports.reserve = onCall({ region: "europe-west1" }, async (request) => {
  const dt = new Date();

  // Helper function to fetch vendor data
  const fetchVendor = async (ref) => {
    const id = ref.split("/")[1];
    return await getRef("vendors").doc(id).get();
  };

  // Helper function to create new records
  const createNewRecord = async (vendor, type, attributes) => {
    const newRecord = { type, attributes };
    return vendor.update((t) => t.addRecord(newRecord));
  };

  // Helper function to remove records
  const removeRecord = async (vendor, record) => {
    return vendor.update((t) => t.removeRecord(record));
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
    return "Error: One or more vendors are invalid.";
  }

  // Create records
  const newTicket = {
    type: "Ticket",
    attributes: {
      sold_date: dt,
      status: "reserved",
      user_id: `${request.auth?.uid}_${Date.now()}`,
      event_id: parseInt(request.data.event.id, 10),
      removed: false,
    },
  };

  const newSeat = {
    type: "Seat",
    attributes: {
      sold_date: dt,
      status: "reserved",
      user_id: `${request.auth?.uid}_${Date.now()}`,
      schedule_id: parseInt(request.data.transportation.id, 10),
      removed: false,
    },
  };

  let response2;
  try {
    response2 = await correctTransportVendor.update((t) =>
      t.addRecord(newSeat)
    );
    console.log("response returned from transport");
    console.log(response2);
  } catch (error) {
    const e = error as ServerError;
    console.log((e.data as any).errors?.at(0)); // Be careful here, there might not be errors in the data.
    console.log((e.data as any).errors?.at(0)?.title); // Message might not exist.
  }

  const correctCateringVendor = sources.catering.find(
    (v) => v.name === cateringVendor.id
  );
  console.log("catering vendor is: ");
  console.log(correctCateringVendor);

  if (!correctCateringVendor) {
    return "Error";
  }
  console.log("caterer exists");

  const newMeal = {
    type: "Meal",
    attributes: {
      meal_date: dt,
      status: "reserved",
      user_id: `${request.auth?.uid}_${Date.now()}`,
      menu_id: parseInt(request.data.food.id, 10),
      removed: false,
    },
  };

  const addedRecords = [];

   const response = {
     reservePackage: {
       package: {
         ticket: {
           id: 10,
           ref: "vendors/PQSwnqknalhyBW8qPB2a/venues/1/events/1/tickets/10",
           user_id: "3458a748-e9bb-47bc-a3f2-c9bf9c6316b9",
           event_id: 0,
           price: 66.61, // Salma, this is the true price of the ticket, the one you have from the event is indicative.
           sold_date: "2024-05-30",
           status: "bought",
           created_at: "2024-06-12 18:36:41.736004+00:00",
           modified_at: "2024-06-12 18:36:41.736485+00:00",
           removed: false,
         },
       },
       result: {
         valid: true,
         message: "",
       },
     },
   };

  try {
    const ticketResponse = await createNewRecord(correctVenueVendor, "Ticket", newTicket.attributes);
    addedRecords.push({ vendor: correctVenueVendor, record: newTicket });
    console.log("Ticket added successfully:", ticketResponse);

    response.reservePackage.package.ticket = {
      id: ticketResponse.id,
      ref: `vendors/${correctVenueVendor.id}/venues/${newTicket.attributes.event_id}/events/${newTicket.attributes.event_id}/tickets/${ticketResponse.id}`,
      user_id: ticketResponse.attributes.user_id,
      event_id: ticketResponse.attributes.event_id,
      price: ticketResponse.attributes.price, // Replace with actual price if available
      sold_date: ticketResponse.attributes.sold_date,
      status: ticketResponse.attributes.status,
      created_at: ticketResponse.attributes.created_at,
      modified_at: ticketResponse.attributes.modified_at,
      removed: ticketResponse.attributes.removed,
    };

    console.log(response.reservePackage.package.ticket)

    const seatResponse = await createNewRecord(
      correctTransportVendor,
      "Seat",
      newSeat.attributes
    );
    addedRecords.push({ vendor: correctTransportVendor, record: newSeat });
    console.log("Seat added successfully:", seatResponse);

    const mealResponse = await createNewRecord(
      correctCateringVendor,
      "Meal",
      newMeal.attributes
    );
    addedRecords.push({ vendor: correctCateringVendor, record: newMeal });
    console.log("Meal added successfully:", mealResponse);
    return [ticketResponse, seatResponse, mealResponse];
  } catch (error) {
    console.error("Error adding records:", error);

    // Rollback added records
    for (const { vendor, record } of addedRecords) {
      try {
        await removeRecord(vendor, record);
        console.log(`Record removed: ${record.type}`);
      } catch (rollbackError) {
        console.error("Error rolling back record:", rollbackError);
      }
    }

    const errors = error?.data?.errors;
    if (errors) {
      console.log(errors.at(0)); // Be careful here, there might not be errors in the data.
      console.log(errors.at(0)?.title); // Message might not exist.
    } else {
      console.error("No errors property in the error object");
    }

    throw error; // Re-throw error to signal failure
  }
});




// TODO: ADD the data to firebase
// TODO: Do all other vendors.
// TODO: Purchases
// TODO: Make sure salma gets the errors so she can display them.
// TODO: Test for errors (full venue), disconnectedvendor, etc.
