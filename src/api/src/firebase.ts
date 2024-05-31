import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const menuRef = db.collection("menus");
const mealRef = db.collection("meals");

const busRef = db.collection("buses");
const scheduleRef = db.collection("schedules");
const seatRef = db.collection("seats");

const venueRef = db.collection("venues");
const eventRef = db.collection("events");
const ticketRef = db.collection("tickets");

const venueVendorRef = db.collection("venueVendors")
const vendorRef = db.collection("vendors");

export {
  db,
  menuRef,
  mealRef,
  busRef,
  scheduleRef,
  seatRef,
  venueRef,
  eventRef,
  ticketRef,
  venueVendorRef,
  vendorRef,
};
