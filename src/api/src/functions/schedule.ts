import * as functions from "firebase-functions";
import sources from "../orbit/sources";

exports.queryCatering = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    const query = sources.catering[0].query((q) => q.findRecords("Meal"));
    const dinners = await query;
    res.json(dinners);
  });

exports.queryTransport = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    const query = sources.transport[0].query((q) => q.findRecords("Seat"));
    const dinners = await query;
    // sources.transport[0]
    res.json(dinners);
  });

exports.queryVenues = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    const query = sources.venues[0].query((q) =>
      q.findRecords("Ticket").options({ include: ["event"] })
    );
    const dinners = await query;
    res.json(dinners);
  });
