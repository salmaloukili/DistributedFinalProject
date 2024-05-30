import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";
import * as base from "../firebase";

// Cloud Function to get all events
exports.getEvents = onCall((request) => {
  return base.db
    .collection("Events")
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

exports.getEventsSeats = onCall((request) => {
    
});