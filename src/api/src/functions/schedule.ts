// @ts-nocheck
import * as functions from "firebase-functions";
import sources from "../orbit/sources";
import { JSONAPISource } from "@orbit/jsonapi";
import { db, getRef, storage} from "../firebase";
import { ref, uploadBytes } from "firebase/storage";



interface JSONAPIParams {
  obj: string;
  time?: Date;
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


async function getData(
  sources: JSONAPISource[],
  params: JSONAPIParams[],
  upload?: boolean
) {

  try {
    const vendorRef = getRef("vendors").doc(sources[0].name);
    const logoUrl = `vendor_logos/${sources[0].name}`;
    const host = sources[0].requestProcessor.urlBuilder.host;
    const oldLogoUrl = `${host}/logo`;
    const newLogoUrl = await uploadImage(oldLogoUrl, logoUrl);
    const logoUrlField = { logo_url: newLogoUrl };

    await vendorRef.update(logoUrlField);
  } catch (error) {
    console.error("Faield to upload logo: ", error);
  }

  const data: any = [];

  for (const source of sources) {
    for (const param of params) {
      try {
        // TODO
        const time = Date.now();
        const query = source.query((q) => {
          let _q = q.findRecords(param.obj);
          // This checks if the time is set. If it is, it will get only newer data 
          // otherwise it queries all of them
          if (param.time) {
            _q = _q.filter({
              attribute: "modified_at",
              op: "gt",
              value: param.time.toJSON().replace("T", " "),
            });
          }
          return _q.options({ include: param.include });
        });

        const result: any = await query;
        const batch = db.batch();
        
        if (upload) {
          for (const element of result) {
            const ref = await param.func(element, source);
            const ids = extractID(element.relationships);
            if (element.attributes.image_url) {
              const host = source.requestProcessor.urlBuilder.host;
              const fullImageUrl = `${host}${element.attributes.image_url}`;
              try {
                const newImageUrl = await uploadImage(fullImageUrl, element.attributes.image_url);
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
        }
        await batch.commit();
        data.push(result);
      } catch (error) {
        continue;
      }
    }
  }
  return data;
}

exports.test = functions.https.onRequest((req, res) => {
  res.json(JSON.parse(process.env.VENDORS));
});

exports.queryTransport = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    // TODO
    // Make query to firestore
    // const busTime, schedTime;
    const data = await getData(
      sources.transport,
      [
        {
          obj: "Bus",
          include: ["schedules"],
          func: async (doc: any, src: any) =>
            getRef("buses", src.name).doc(doc.id),
          // time: busTime,
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
      ],
      true
    );
    res.json(data);
  });

exports.queryCatering = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    const data = await getData(
      sources.catering,
      [
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
      ],
      true
    );

    res.json(data);
  });

exports.queryVenues = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    const data = await getData(
      sources.venues,
      [
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
      ],
      true
    );
    res.json(data);
  });
