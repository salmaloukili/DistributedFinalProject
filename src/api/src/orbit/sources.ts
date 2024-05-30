import JSONAPISource from "@orbit/jsonapi";
import { caterVendor, transportVendor, venueVendor } from "./schemas";

const caterSource = new JSONAPISource({
  schema: caterVendor,
  name: "remote",
  host: "http://127.0.0.1:5000",
  namespace: "api/catering",
  defaultFetchSettings: {
    headers: {
      Authorization: "Bearer token",
    },
  },
});

const transportSource = new JSONAPISource({
  schema: transportVendor,
  name: "remote",
  host: "http://127.0.0.1:5000",
  namespace: "api/transport",
  defaultFetchSettings: {
    headers: {
      Authorization: "Bearer token",
    },
  },
});

const venueSource = new JSONAPISource({
  schema: venueVendor,
  name: "remote",
  host: "http://127.0.0.1:5000",
  namespace: "api/venues",
  defaultFetchSettings: {
    headers: {
      Authorization: "Bearer token",
    },
  },
});

const sources = {
  catering: [caterSource],
  transport: [transportSource],
  venues: [venueSource],
};
export default sources;
