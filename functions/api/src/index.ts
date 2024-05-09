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

router.get("/htm", (req: Request, res: Response) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr;
  res.send(`
      <!doctype html>
      <head>
        <title>Time</title>
        <link rel="stylesheet" href="/style.css">
        <script src="/script.js"></script>
      </head>
      <body>
        <p>In London, the clock strikes:
          <span id="bongs">${"BONG ".repeat(hours)}</span></p>
        <button onClick="refresh(this)">Refresh</button>
      </body>
    </html>`);
});

router.get("/test", (req: Request, res: Response) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr;
  res.json({ bongs: "BONG ".repeat(hours) });
});

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
