import { onCall } from "firebase-functions/v2/https";
import * as base from "../firebase";
import { db, getRef } from "../firebase";
import sources from "../orbit/sources";
import { Timestamp } from "firebase-admin/firestore";
// Cloud Function to get all events
exports.getEvents = onCall(
  {
    region: "europe-west1",
    minInstances: 1,
  },
  async (request) => {
    const eventPromise = base.db
      .collectionGroup("events")
      .limit(request.data.limit)
      .offset(request.data.offset)
      .get();
    const venuePromise = base.db.collectionGroup("venues").get();
    const vendorPromise = base.db
      .collection("vendors")
      .where("type", "==", "Venue")
      .get();

    const [events, venues, vendors] = await Promise.all([
      eventPromise,
      venuePromise,
      vendorPromise,
    ]);

    const data = events.docs.map((doc) => {
      const splitRef = doc.ref.path.split("/");
      const vendorID = splitRef.at(1);
      const venueRef = splitRef.slice(0, 4).join("/");

      return {
        id: doc.id,
        ref: doc.ref.path,
        ...doc.data(),
        vendor: vendors.docs.find((vn) => vn.id === vendorID)?.data(),
        venue: venues.docs.find((ve) => ve.ref.path === venueRef)?.data(),
      };
    });
    return data;
  }
);

//Cloud Function to get transportation schedules for a specific date
exports.getTransportation = onCall(
  {
    region: "europe-west1",
    minInstances: 1,
  },
  async (request) => {
    const requestData = request.data;
    const eventDate = new Timestamp(requestData.event.date._seconds, 0);

    const schedulePromise = base.db
      .collectionGroup("schedules")
      .where("departure_date", "==", eventDate.toDate())
      .limit(requestData.limit)
      .offset(requestData.offset)
      .get();
    const busPromise = base.db.collectionGroup("buses").get();
    const vendorPromise = base.db
      .collection("vendors")
      .where("type", "==", "Transport")
      .get();

    const [schedules, buses, vendors] = await Promise.all([
      schedulePromise,
      busPromise,
      vendorPromise,
    ]);

    const data = schedules?.docs.map((doc) => {
      const docData = doc.data();
      const splitRef = doc.ref.path.split("/");
      const vendorID = splitRef.at(1);
      const busRef = splitRef.slice(0, 4).join("/");
      return {
        id: doc.id,
        ref: doc.ref.path,
        ...docData,
        bus: buses.docs.find((bus) => bus.ref.path === busRef)?.data(),
        vendor: vendors.docs.find((vn) => vn.id === vendorID)?.data(),
      };
    });
    return data;
  }
);

exports.getFood = onCall(
  {
    region: "europe-west1",
  },
  async (request) => {
    const requestData = request.data;
    const menuPromise = base.db
      .collectionGroup("menus")
      .limit(requestData.limit)
      .offset(requestData.offset)
      .get();
    const vendorPromise = base.db
      .collection("vendors")
      .where("type", "==", "Catering")
      .get();
    const [vendors, menus] = await Promise.all([vendorPromise, menuPromise]);

    const data = menus.docs.map((doc) => {
      const vendorID = doc.ref.path.split("/").at(1);
      return {
        id: doc.id,
        ref: doc.ref.path,
        ...doc.data(),
        vendor: vendors.docs.find((vn) => vn.id === vendorID)?.data(),
      };
    });
    return data;
  }
);

exports.getAllUsers = onCall(
  {
    region: "europe-west1",
  },
  async (request) => {
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
  }
);

exports.getAllPackages = onCall(
  {
    region: "europe-west1",
  },
  async (request) => {
    if (
      request.auth?.uid &&
      (await base.auth.getUser(request.auth.uid)).customClaims?.role === "admin"
    ) {
      const querySnapshot = await base.db.collection("purchases").get();
      return querySnapshot.docs.map((e) => e.data());
    }
    return "Authentication Error";
  }
);

exports.reserve = onCall(
  {
    region: "europe-west1",
  },
  async (request) => {
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
    const correctVenueVendor = (await sources.venues).find(
      (v) => v.name === eventVendor.id
    );
    const correctTransportVendor = (await sources.transport).find(
      (v) => v.name === transportVendor.id
    );
    const correctCateringVendor = (await sources.catering).find(
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

    const errors = [];

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
            meal_date: request.data.event.date,
            status: "reserved",
            user_id: request.auth?.uid,
            menu_id: parseInt(request.data.food.id, 10),
            removed: false,
          },
        })
      );
      const batch = db.batch();
      const ticketDB = db
        .doc(request.data.event.ref)
        .collection("tickets")
        .doc(ticketResponse.id);
      batch.create(ticketDB, {
        id: ticketResponse.id,
        ...ticketResponse.attributes,
      });
      const seatDB = db
        .doc(request.data.transportation.ref)
        .collection("seats")
        .doc(seatResponse.id);
      batch.create(seatDB, {
        id: seatResponse.id,
        ...seatResponse.attributes,
      });
      const mealDB = db
        .doc(request.data.food.ref)
        .collection("meals")
        .doc(mealResponse.id);
      batch.create(mealDB, {
        id: mealResponse.id,
        ...mealResponse.attributes,
      });
      const purchase = db.collection("purchases").doc();
      const response = {
        id: purchase.id,
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
        others: request.data,
        result: {
          valid: true,
          message:
            ticketResponse.attributes.price === request.data.event.price
              ? "Success"
              : `WARNING! Price changed from ${request.data.event.price} to ${ticketResponse.attributes.price}`,
        },
      };
      batch.create(purchase, response);
      console.log(response);
      await batch.commit();
      return response;
    } catch (error) {
      console.error("Error adding records:", error);
      errors.push(error);

      // Rollback added records
      try {
        correctVenueVendor.update((t: any) =>
          t.removeRecord({ type: "Ticket", id: ticketResponse.id })
        );
      } catch (rollbackError) {
        errors.push(rollbackError);
        console.error("Error rolling back record:", rollbackError);
      }
      try {
        correctCateringVendor.update((t: any) =>
          t.removeRecord({ type: "Meal", id: mealResponse.id })
        );
      } catch (rollbackError) {
        errors.push(rollbackError);
        console.error("Error rolling back record:", rollbackError);
      }
      try {
        correctTransportVendor.update((t: any) =>
          t.removeRecord({ type: "Seat", id: seatResponse.id })
        );
      } catch (rollbackError) {
        errors.push(rollbackError);
        console.error("Error rolling back record:", rollbackError);
      }

      return {
        result: {
          valid: false,
          message: errors,
        },
      };
    }
  }
);

exports.getUserPackages = onCall(
  {
    region: "europe-west1",
  },
  async (request) => {
    const querySnapshot = await base.db
      .collection("purchases")
      .where("user_id", "==", request.auth?.uid)
      .where("status", "==", "bought")
      .get();

    return querySnapshot.docs.map((e) => e.data());
  }
);

exports.buyPackage = onCall(
  {
    region: "europe-west1",
  },
  async (request) => {
    const success: String[] = [];
    const errors: String[] = [];
    let valid = true;
    console.log(request.data);

    for (const data of request.data) {
      console.log(data);

      const correctVenueVendor = (await sources.venues).find(
        (v) => v.name === data.event.ref.split("/")[1]
      );
      const correctTransportVendor = (await sources.transport).find(
        (v) => v.name === data.transportation.ref.split("/")[1]
      );
      const correctCateringVendor = (await sources.catering).find(
        (v) => v.name === data.food.ref.split("/")[1]
      );

      try {
        correctVenueVendor?.update((t: any) =>
          t.updateRecord({
            type: "Ticket",
            id: data.ticket.id,
            attributes: {
              status: "bought",
            },
          })
        );

        correctTransportVendor?.update((t: any) =>
          t.updateRecord({
            type: "Seat",
            id: data.seat.id,
            attributes: {
              status: "bought",
            },
          })
        );

        correctCateringVendor?.update((t: any) =>
          t.updateRecord({
            type: "Meal",
            id: data.meal.id,
            attributes: {
              status: "bought",
            },
          })
        );
        const batch = db.batch();
        batch.update(db.collection("purchases").doc(data.id), {
          status: "bought",
          "ticket.status": "bought",
          "meal.status": "bought",
          "seat.status": "bought",
        });

        batch.update(db.doc(data.ticket.ref), {
          status: "bought",
        });

        batch.update(db.doc(data.meal.ref), {
          status: "bought",
        });

        batch.update(db.doc(data.seat.ref), {
          status: "bought",
        });
        await batch.commit();
        success.push(data.id);
      } catch (error) {
        console.error("Error purchasing:", error);
        errors.push(String(error));
        valid = false;
        continue;
      }
    }
    return {
      result: {
        valid: valid,
        message: errors,
        ids: success,
      },
    };
  }
);

exports.removePackage = onCall(
  {
    region: "europe-west1",
  },
  async (request) => {
    const purchaseDoc = (
      await base.db.collection("purchases").doc(request.data.id).get()
    ).data();
    //Handle error if the ref doesn't exist

    const ticketRef = purchaseDoc?.ticket.ref;
    const seatRef = purchaseDoc?.seat.ref;
    const mealRef = purchaseDoc?.meal.ref;
    console.log(ticketRef);
    console.log(seatRef);
    console.log(mealRef);
    // Helper function to fetch vendor data
    const fetchVendor = async (ref: any) => {
      console.log(ref);
      const id = ref.split("/")[1];
      return await getRef("vendors").doc(id).get();
    };

    // Fetch all vendors
    const [eventVendor, transportVendor, cateringVendor] = await Promise.all([
      fetchVendor(ticketRef),
      fetchVendor(seatRef),
      fetchVendor(mealRef),
    ]);

    // Validate vendors
    const correctVenueVendor = (await sources.venues).find(
      (v) => v.name === eventVendor.id
    );
    const correctTransportVendor = (await sources.transport).find(
      (v) => v.name === transportVendor.id
    );
    const correctCateringVendor = (await sources.catering).find(
      (v) => v.name === cateringVendor.id
    );

    if (
      !correctVenueVendor ||
      !correctTransportVendor ||
      !correctCateringVendor
    ) {
      const a = {
        result: {
          valid: false,
          errors: "Error: One or more vendors are invalid.",
        },
      };
      console.log(a);
      return {
        valid: false,
        errors: "Error: One or more vendors are invalid.",
      };
    }

    const errors = [];

    try {
      correctVenueVendor.update((t: any) =>
        t.removeRecord({ type: "Ticket", id: ticketRef.split("/").at(-1) })
      );
    } catch (rollbackError) {
      errors.push(rollbackError);
      console.error("Error removing ticket reservation:", rollbackError);
    }

    try {
      correctTransportVendor.update((t: any) =>
        t.removeRecord({ type: "Seat", id: seatRef.split("/").at(-1) })
      );
    } catch (rollbackError) {
      errors.push(rollbackError);
      console.error("Error removing seat reservation:", rollbackError);
    }

    try {
      correctCateringVendor.update((t: any) =>
        t.removeRecord({ type: "Meal", id: mealRef.split("/").at(-1) })
      );
    } catch (rollbackError) {
      errors.push(rollbackError);
      console.error("Error removing meal reservation:", rollbackError);
    }

    await base.db.collection("purchases").doc(request.data.id).delete();
    await base.db.doc(ticketRef).delete();
    await base.db.doc(seatRef).delete();
    await base.db.doc(mealRef).delete();

    const response = {
      valid: errors.length == 0 ? true : false,
      errors: errors,
    };
    console.log("response");

    return response;
  }
);
