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
  const date = new Date();
  date.setHours(10);
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    for (let j = 0; j < params.length; j++) {
      const query = source.query((q) =>
        q.findRecords(params[j].obj).filter({
          attribute: "modified_at",
          op: "gt",
          value: date.toJSON().replace("T", " "),
        })
      );
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
  .https.onRequest(async (req, res) => {
    const data = [];
    let query = sources.transport[0].query(
      (q) => q.findRecords("Bus")
      // .sort({ attribute: "modified_at", order: "descending" })
      // .page({ offset: 0, limit: 2 })
      // .options({ include: ["events"] })
    );
    data[0] = await query;

    query = sources.transport[0].query((q) =>
      q
        .findRecords("Schedule")
        // .page({ offset: 0, limit: 1 })
        .options({ include: ["bus"] })
    );
    data[1] = await query;

    query = sources.transport[0].query((q) =>
      q
        .findRecords("Seat")
        .sort({ attribute: "modified_at", order: "descending" })
        .page({ offset: 0, limit: 1 })
        .options({ include: ["schedule"] })
    );
    data[2] = await query;

    res.json(data);
  });
