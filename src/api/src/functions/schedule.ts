import * as functions from "firebase-functions";
import sources from "../orbit/sources";

exports.queryCatering = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    const data = [];
    let query = sources.transport[0].query(
      (q) => q.findRecords("Bus")
      // .page({ offset: 0, limit: 1 })
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
        // .page({ offset: 0, limit: 1 })
        .options({ include: ["schedule"] })
    );
    data[2] = await query;

    res.json(data);
  });

exports.queryTransport = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    const data = [];
    let query = sources.catering[0].query(
      (q) => q.findRecords("Menu")
      // .page({ offset: 0, limit: 1 })
      // .options({ include: ["events"] })
    );
    data[0] = await query;

    query = sources.catering[0].query((q) =>
      q
        .findRecords("Meal")
        // .page({ offset: 0, limit: 1 })
        .options({ include: ["menu"] })
    );
    data[1] = await query;

    res.json(data);
  });

exports.queryVenues = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    const data = [];
    let query = sources.venues[0].query(
      (q) => q.findRecords("Venue")
      // .page({ offset: 0, limit: 1 })
      // .options({ include: ["events"] })
    );
    data[0] = await query;

    query = sources.venues[0].query((q) =>
      q
        .findRecords("Event")
        // .page({ offset: 0, limit: 1 })
        .options({ include: ["venue"] })
    );
    data[1] = await query;

    query = sources.venues[0].query((q) =>
      q
        .findRecords("Ticket")
        // .page({ offset: 0, limit: 1 })
        .options({ include: ["event"] })
    );
    data[2] = await query;

    res.json(data);
  });
