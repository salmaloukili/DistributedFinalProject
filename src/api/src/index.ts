import express, { Application, Request, Response } from "express";
// import { Model } from "coloquent";
import { RecordSchema } from "@orbit/records";
import { JSONAPISource } from "@orbit/jsonapi";
import { onCall } from "firebase-functions/v1/https";
import * as testing from "./testing";



const app: Application = express();
const router = express.Router();

app.use("/api", router);

// export const functions_api = functions
//   .region("europe-west1")
//   .https.onRequest(app);
exports.getGreeting = onCall((request) => {
  return "Hello, world!";
});
exports.test = testing;