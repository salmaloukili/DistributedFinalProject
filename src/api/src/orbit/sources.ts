import JSONAPISource from "@orbit/jsonapi";
import { caterVendor, transportVendor, venueVendor } from "./schemas";

const caterSource = new JSONAPISource({
  schema: caterVendor,
  name: "remote",
  host: "http://127.0.0.1:5000/",
  namespace: "api",
});
const transportSource = new JSONAPISource({
  schema: transportVendor,
  name: "remote",
  host: "http://127.0.0.1:5000/",
  namespace: "api",
});
const venueSource = new JSONAPISource({
  schema: venueVendor,
  name: "remote",
  host: "http://127.0.0.1:5000/",
  namespace: "api",
});

const sources = {
  catering: [caterSource],
  transport: [transportSource],
  venues: [venueSource],
};
export default sources;
