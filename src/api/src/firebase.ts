import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();
const menuRef = db.collection("menus");
const mealRef = db.collection("meals");

const busRef = db.collection("buses");
const scheduleRef = db.collection("schedules");
const seatRef = db.collection("seats");

const venueRef = db.collection("venues");
const eventRef = db.collection("events");
const ticketRef = db.collection("tickets");

const venueVendorRef = db.collection("venueVendors");
const vendorRef = db.collection("vendors");

function getRef(collection: string, ...args: string[]) {
  switch (collection) {
    case "venues":
      return vendorRef.doc(String(args[0])).collection("venues");
    case "events":
      return vendorRef
        .doc(String(args[0]))
        .collection("venues")
        .doc(String(args[1]))
        .collection("events");
    case "tickets":
      return vendorRef
        .doc(String(args[0]))
        .collection("venues")
        .doc(String(args[1]))
        .collection("events")
        .doc(String(args[2]))
        .collection("tickets");
    case "buses":
      return vendorRef.doc(String(args[0])).collection("buses");
    case "schedules":
      return vendorRef
        .doc(String(args[0]))
        .collection("buses")
        .doc(String(String(args[1])))
        .collection("schedules");
    case "seats":
      return vendorRef
        .doc(String(args[0]))
        .collection("buses")
        .doc(String(args[1]))
        .collection("schedules")
        .doc(String(args[2]))
        .collection("seats");
    case "menus":
      return vendorRef.doc(String(args[0])).collection("menus");
    case "meals":
      return vendorRef
        .doc(String(args[0]))
        .collection("menus")
        .doc(String(args[1]))
        .collection("meals");
    case "vendors":
      return vendorRef;
    default:
      throw new Error("Not part of schema");
  }
}

export {
  db,
  auth,
  storage,
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
  getRef,
};
