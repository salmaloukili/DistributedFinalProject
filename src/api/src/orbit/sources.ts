import JSONAPISource from "@orbit/jsonapi";
import { caterVendor, transportVendor, venueVendor } from "./schemas";

const source = new JSONAPISource({
  schema: caterVendor,
  name: "remote",
  host: "http://127.0.0.1:5000/",
  namespace: "api",
});

interface Host {
  kind: "catering" | "transport" | "venues";
  url: string;
}
const sources = {
  catering: [source],
  transport: [source],
  venues: [source],
};
export default source;
