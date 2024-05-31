import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";
import * as base from "../firebase";

// Cloud Function to get all events
exports.getEvents = onCall((request) => {
  return base.db
    .collection("events")
    .get()
    .then((eventsSnapshot) => {
      const events: { id: string; data: admin.firestore.DocumentData }[] = [];
      eventsSnapshot.forEach((doc) => {
        events.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      return { success: true, events };
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
      return { success: false, error: error.message };
    });
});

// Cloud Function to get transportation schedules for a specific date
exports.getTransportation = onCall((request) => {
  const { date } = request.data;

  if (!date) {
    return { success: false, error: "Date is required" };
  }

  // Convert the input date to a JavaScript Date object
  const inputDate = new Date(date); 

  // Create Firestore timestamps for the start and end of the day
  const startOfDay = admin.firestore.Timestamp.fromDate(
    new Date(inputDate.setHours(0, 0, 0, 0))
  );
  const endOfDay = admin.firestore.Timestamp.fromDate(
    new Date(inputDate.setHours(23, 59, 59, 999))
  );

  return base.db
    .collection("schedules")
      .where("departure_date", ">=", startOfDay)
      .where("departure_date", "<=", endOfDay)
      .get()
      .then((schedulesSnapshot) => {
        const schedules: { id: string; data: admin.firestore.DocumentData }[] =
          [];
        schedulesSnapshot.forEach((doc) => {
          schedules.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        return { success: true, schedules };
      })
      .catch((error) => {
        console.error("Error fetching schedules:", error);
        return { success: false, error: error.message };
      });
});

exports.getFood = onCall((request) => {

  return base.db
    .collection("menus")
    .get()
    .then((menusSnapshot) => {
      const menus: { id: string; data: admin.firestore.DocumentData }[] = [];
      menusSnapshot.forEach((doc) => {
        menus.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      return { success: true, menus };
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
      return { success: false, error: error.message };
    });

});