import { onCall } from "firebase-functions/v1/https";
import * as testing from "./functions/testing";




exports.getGreeting = onCall((request) => {
  return "Hello, world!";
});



exports.test = testing;
