import * as functions from "firebase-functions";
import sources from "../orbit/sources";
import { JSONAPISource } from "@orbit/jsonapi";
import admin from "firebase-admin";

interface JSONAPIParams {
  obj: string;
  time?: Date;
  include?: string[];
}

async function getNewData(sources: JSONAPISource[], params: JSONAPIParams[]) {
  const data: any = [];
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    for (let j = 0; j < params.length; j++) {
      const param = params[j];

      const query = source.query((q) => {
        const _q = q.findRecords(params[j].obj);
        if (param.time) {
          return _q.filter({
            attribute: "modified_at",
            op: "gt",
            value: param.time.toJSON().replace("T", " "),
          });
        } else {
          return _q;
        }
      });
      data.push(await query);
    }
    console.log(data)
    return data;
  }
}

exports.queryUpdatedTransport = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    res.json(
      await getNewData(sources.transport, [
        { obj: "Bus" },
        { obj: "Schedule" },
        { obj: "Seat" },
      ])
    );
  });

exports.queryUpdatedCatering = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    res.json(
      await getNewData(sources.catering, [{ obj: "Menu" }, { obj: "Meal" }])
    );

  });

exports.queryUpdatedVenues = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    res.json(
      await getNewData(sources.transport, [
        { obj: "Venue" },
        { obj: "Event" },
        { obj: "Ticket" },
      ])
    );
  });



async function getData(
  sources: JSONAPISource[],
  params: JSONAPIParams[],
  vendorType: string,
  docId: string
) { 
  const data: any = [];
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    for (let j = 0; j < params.length; j++) {
      const param = params[j];
      console.log(param)
      const query = source.query((q) => {
        const _q = q.findRecords(params[j].obj);
        if (param.time) {
          return _q.filter({
            attribute: "modified_at",
            op: "gt",
            value: param.time.toJSON().replace("T", " "),
          });
        } else {
          return _q.options({include: param.include});
        }
      });

      const result = await query;
      console.log(result);
      data.push(result);
      await writeToFirestore(vendorType, param.obj, result, docId);
    }
  }
  return data;
}

async function writeToFirestore(
  vendorType: string,
  objType: string,
  data: any,
  docId: string
) {
  const vendorDocRef = admin.firestore().collection(vendorType).doc(docId);

  for (const record of data) {
    const recordData = {
      ...record.attributes,
      relationships: record.relationships,
    };
    await vendorDocRef.collection(objType).doc(record.id).set(recordData);
  }
}


exports.queryTransport = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    try {
      const vendorType = "transportVendors";
      const docRef = admin.firestore().collection(vendorType).doc();
      const docId = docRef.id;
      const data = await getData(
        sources.transport,
        [
          { obj: "Bus", include: ["schedules"] },
          { obj: "Schedule", include: ["bus", "seats"] },
          { obj: "Seat", include: ["schedule"] },
        ],
        vendorType,
        docId
      );
      res.json(data);
    } catch (error) {
      console.error("Error querying transport data: ", error);
      res.status(500).send("Internal Server Error");
    }
  });

exports.queryCatering = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    try {
      const vendorType = "caterVendors"
      const docRef = admin.firestore().collection(vendorType).doc();
      const docId = docRef.id;
      const data = await getData(
        sources.catering,
        [
          { obj: "Menu", include: ["meals"] },
          { obj: "Meal", include: ["menu"] },
        ],
        vendorType,
        docId
      );
      res.json(data);
    } catch (error) {
      console.error("Error querying catering data: ", error);
      res.status(500).send("Internal Server Error");
    }
  });

exports.queryVenues = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    try {
      const vendorType = "venueVendors";
      const docRef = admin.firestore().collection(vendorType).doc();
      const docId = docRef.id;
      const data = await getData(
        sources.venues,
        [{ obj: "Venue", include: ["events"] }, { obj: "Event", include: ["venue", "tickets"] }, { obj: "Ticket", include: ["event"] }],
        vendorType,
        docId
      );
      res.json(data);
    } catch (error) {
      console.error("Error querying venue data: ", error);
      res.status(500).send("Internal Server Error");
    }
  });