// @ts-nocheck
import * as functions from "firebase-functions";
import sources from "../orbit/sources";
import { JSONAPISource } from "@orbit/jsonapi";
import { db, getRef, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";

interface JSONAPIParams {
  obj: string;
  include?: string[];
  func?: Function;
}

function extractID(relationships) {
  const idsByType = {};
  for (const key in relationships) {
    if (relationships[key].data && Array.isArray(relationships[key].data)) {
      relationships[key].data.forEach((item) => {
        if (!idsByType[item.type.toLowerCase()]) {
          idsByType[item.type.toLowerCase()] = [];
        }
        idsByType[item.type.toLowerCase()].push(item.id);
      });
    }
  }

  return idsByType;
}

async function blobToBuffer(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadImage(fullImageUrl, storageImageUrl) {
  if (storageImageUrl.startsWith("/")) {
    storageImageUrl = storageImageUrl.substring(1);
  }

  const response = await fetch(fullImageUrl);
  const blob = await response.blob();

  const buffer = await blobToBuffer(blob);

  const bucket = storage.bucket();
  const file = bucket.file(storageImageUrl);

  await file.save(buffer, {
    metadata: { contentType: blob.type },
  });
  return storageImageUrl;
}

async function updateLastModified(documentId: string) {
  try {
    const collectionRef = db.collection("last_modified");
    const documentRef = collectionRef.doc(documentId);
    const time = new Date();

    await documentRef.set({
      last_modified: time,
    });
  } catch (error) {
    console.error(`Failed to create/update document ${documentId}:`, error);
  }
}

async function getLastModified(documentId: string) {
  try {
    const collectionRef = db.collection("last_modified");
    const documentRef = collectionRef.doc(documentId);
    const docSnapshot = await documentRef.get();

    console.log("RAN LAST MODIFIED");
    if (!docSnapshot.exists) {
      return -1;
    } else {
      return docSnapshot.data().last_modified.toDate();
    }
  } catch (error) {
    console.error(`Failed to get document ${documentId}:`, error);
  }
}

async function getData(srcs: JSONAPISource[], params: JSONAPIParams[]) {
  const data: any = [];
  for (const source of srcs) {
    const vendorRef = getRef("vendors").doc(source.name);
    const vendorDoc = await vendorRef.get();
    const vendorData = vendorDoc.data();
    if (!vendorData?.logo_url) {
      try {
        const logoUrl = `vendor_logos/${source.name}`;
        const host = source.requestProcessor.urlBuilder.host;
        const oldLogoUrl = `${host}/logo`;
        const newLogoUrl = await uploadImage(oldLogoUrl, logoUrl);
        const logoUrlField = { logo_url: newLogoUrl };

        await vendorRef.update(logoUrlField);
      } catch (error) {
        console.error("Faield to upload logo: ", error);
      }
    }

    const time = await getLastModified(source.name);
    for (const param of params) {
      try {
        const query = source.query((q) => {
          let _q = q.findRecords(param.obj);

          if (time != -1) {
            _q = _q.filter({
              attribute: "modified_at",
              op: "gt",
              value: time.toJSON().replace("T", " "),
            });
          }
          return _q.options({ include: param.include });
        });

        const result: any = await query;
        const batch = db.batch();
        for (const element of result) {
          const ref = await param.func(element, source);
          const ids = extractID(element.relationships);
          if (element.attributes.image_url) {
            const host = source.requestProcessor.urlBuilder.host;
            const fullImageUrl = `${host}${element.attributes.image_url}`;
            try {
              const newImageUrl = await uploadImage(
                fullImageUrl,
                "images/" + source.name + element.attributes.image_url
              );
              element.attributes.image_url = newImageUrl;
            } catch (error) {
              console.error("Failed to upload image: ", error);
              continue;
            }
          }
          batch.set(ref, {
            ...element.attributes,
            relationships: ids,
          });
        }

        await updateLastModified(source.name);
        await batch.commit();
      } catch (error) {
        console.log(error);
        continue;
      }
    }
  }
}

exports.queryTransport = functions
  .region("europe-west1")
  .runWith({
    timeoutSeconds: 540,
  })
  .pubsub.schedule("every 2 minutes")
  .onRun(async (context) => {
    await getData(await sources.transport, [
      {
        obj: "Bus",
        include: ["schedules"],
        func: async (doc: any, src: any) =>
          getRef("buses", src.name).doc(doc.id),
      },
      {
        obj: "Schedule",
        include: ["bus", "seats"],
        func: async (doc: any, src: any) =>
          getRef("schedules", src.name, doc.attributes.bus_id).doc(doc.id),
      },
      {
        obj: "Seat",
        include: ["schedule"],
        func: async (doc: any, src: any) => {
          const ref = await getRef("vendors")
            .doc(src.name)
            .collection("buses")
            .where("relationships.schedule", "array-contains-any", [
              String(doc.attributes.schedule_id),
            ])
            .get();
          return getRef(
            "seats",
            src.name,
            ref.docs[0]?.id,
            doc.attributes.schedule_id
          ).doc(doc.id);
        },
      },
    ]);
  });

exports.queryCatering = functions
  .region("europe-west1")
  .runWith({
    timeoutSeconds: 540,
  })
  .pubsub.schedule("every 5 minutes")
  .onRun(async (context) => {
    await getData(await sources.catering, [
      {
        obj: "Menu",
        include: ["meals"],
        func: async (doc: any, src: any) =>
          getRef("menus", src.name).doc(doc.id),
      },
      {
        obj: "Meal",
        include: ["menu"],
        func: async (doc: any, src: any) =>
          getRef("meals", src.name, doc.attributes.menu_id).doc(doc.id),
      },
    ]);
  });

exports.queryVenues = functions
  .region("europe-west1")
  .runWith({
    timeoutSeconds: 540,
  })
  .pubsub.schedule("every 5 minutes")
  .onRun(async (context) => {
    await getData(await sources.venues, [
      {
        obj: "Venue",
        include: ["events"],
        func: async (doc: any, src: any) =>
          getRef("venues", src.name).doc(doc.id),
      },
      {
        obj: "Event",
        include: ["tickets", "venue"],
        func: async (doc: any, src: any) =>
          getRef("events", src.name, doc.attributes.venue_id).doc(doc.id),
      },
      {
        obj: "Ticket",
        include: ["event"],
        func: async (doc: any, src: any) => {
          const ref = await getRef("vendors")
            .doc(src.name)
            .collection("venues")
            .where("relationships.event", "array-contains-any", [
              String(doc.attributes.event_id),
            ])
            .get();
          return getRef(
            "tickets",
            src.name,
            ref.docs[0].id,
            doc.attributes.event_id
          ).doc(doc.id);
        },
      },
    ]);
  });
