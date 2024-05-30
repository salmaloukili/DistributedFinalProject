import * as functions from "firebase-functions";

exports.queryCatering = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    res.json({ hello: "Hello" });
  });
