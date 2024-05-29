import { onCall } from "firebase-functions/v2/https";

exports.testfunc1 = onCall((request) => {
  return "Hello, world!";
});

exports.testfunc2 = onCall((request) => {
  return "Hello, world!";
});

exports.testfunc3 = onCall((request) => {
  return "Hello, world!";
});
