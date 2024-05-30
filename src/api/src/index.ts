import { onCall } from "firebase-functions/v1/https";
import * as testing from "./functions/testing";
import * as faker from "./functions/faker";
import * as endpoints from "./functions/endpoints";

exports.getGreeting = onCall((request) => {
  return "Hello, world!";
});

exports.test = testing;
exports.faker = faker;
exports.endpoints = endpoints;
