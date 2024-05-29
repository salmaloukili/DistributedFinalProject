import * as functions from "firebase-functions";
import express, { Application, Request, Response } from "express";
// import { Model } from "coloquent";
import { RecordSchema } from "@orbit/records";
import { JSONAPISource } from "@orbit/jsonapi";

const schema = new RecordSchema({
  models: {
    Employee: {
      attributes: {
        first_name: { type: "string" },
        last_name: { type: "string" },
        email: { type: "string" },
        privileges: { type: "string" },
        hire_date: { type: "date" },
        salary: { type: "number" },
        created_at: { type: "datetime" },
        modified_at: { type: "datetime" },
      },
    },
  },
});

const source = new JSONAPISource({
  schema,
  name: "remote",
  host: "http://127.0.0.1:5000/",
  namespace: "api",
});

const app: Application = express();
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const users = source.query((q) => q.findRecords("Employee"));
  users
    .then((r) => {
      res.json(r);
    })
    .catch((e) => {
      console.log(e);
      res.send(`${e}`);
    });
});

app.use("/api", router);

export const functions_api = functions
  .region("europe-west1")
  .https.onRequest(app);
