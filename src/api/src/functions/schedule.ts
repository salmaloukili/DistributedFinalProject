import * as functions from "firebase-functions";
import sources from "../orbit/sources";
import { JSONAPISource } from "@orbit/jsonapi";

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
    return data;
  }
}

exports.queryTransport = functions
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

exports.queryCatering = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    res.json(
      await getNewData(sources.catering, [{ obj: "Menu" }, { obj: "Meal" }])
    );
  });

exports.queryVenues = functions
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

exports.queryUpdatedCatering = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {});
