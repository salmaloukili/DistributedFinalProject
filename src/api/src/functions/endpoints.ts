import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";
import * as base from "../firebase";

// Cloud Function to get all events
exports.getEvents = onCall(async (request) => {
  const querySnapshot = await base.db.collectionGroup("events").get();
  const data = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ref: doc.ref.path, ...doc.data() };
  });
  return data;
});


//Cloud Function to get transportation schedules for a specific date
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
    .collection("vendors")
    .where("type", "==", "Transport")
    .get()
    .then((vendorsSnapshot) => {
      const promises: any[] = [];

      vendorsSnapshot.forEach((vendorDoc) => {
        const busesPromise = vendorDoc.ref
          .collection("buses")
          .get()
          .then((busesSnapshot) => {
            const schedulePromises: any[] = [];

            busesSnapshot.forEach((busDoc) => {
              const schedulesPromise = busDoc.ref
                .collection("schedules")
                .where("departure_date", ">=", startOfDay)
                .where("departure_date", "<=", endOfDay)
                .get()
                .then((schedulesSnapshot) => {
                  const schedules: any[] | PromiseLike<any[]> = [];

                  schedulesSnapshot.forEach((scheduleDoc) => {
                    schedules.push({
                      id: scheduleDoc.id,
                      data: scheduleDoc.data(),
                    });
                  });

                  return schedules;
                });

              schedulePromises.push(schedulesPromise);
            });

            return Promise.all(schedulePromises);
          });

        promises.push(busesPromise);
      });

      return Promise.all(promises);
    })
    .then((results) => {
      const schedules = results.flat(2); // Flatten the array structure
      return { success: true, schedules };
    })
    .catch((error) => {
      console.error("Error fetching schedules:", error);
      return { success: false, error: error.message };
    });
});



exports.getFood = onCall((request) => {
  return base.db
    .collection("vendors")
    .where("type", "==", "Catering")
    .get()
    .then((vendorsSnapshot) => {
      const promises: any[] = [];

      vendorsSnapshot.forEach((vendorDoc) => {
        const menusPromise = vendorDoc.ref
          .collection("menus")
          .get()
          .then((menusSnapshot) => {
            const menus: any[] | PromiseLike<any[]> = [];

            menusSnapshot.forEach((menuDoc) => {
              menus.push({
                id: menuDoc.id,
                data: menuDoc.data(),
              });
            });

            return menus;
          });

        promises.push(menusPromise);
      });

      return Promise.all(promises);
    })
    .then((results) => {
      const menus = results.flat(); // Flatten the array structure
      return { success: true, menus };
    })
    .catch((error) => {
      console.error("Error fetching menus:", error);
      return { success: false, error: error.message };
    });
});
