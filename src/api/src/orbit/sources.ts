// @ts-nocheck
import JSONAPISource, {
  JSONAPIURLBuilder,
  RecordQueryRequest,
  RecordTransformRequest,
} from "@orbit/jsonapi";

import { caterVendor, transportVendor, venueVendor } from "./schemas";
import { FilterSpecifier } from "@orbit/records";
import { Dict } from "@orbit/utils";

class FilterJSONAPIURLBuilder extends JSONAPIURLBuilder {
  buildFilterParam(
    filters: FilterSpecifier[] | Dict<unknown | unknown[]>,
    request?: RecordQueryRequest | RecordTransformRequest
  ): Dict<unknown>[] {
    let params = [];
    filters.forEach((filterSpecifier, index) => {
      if (
        filterSpecifier.kind === "attribute" &&
        ["gt", "lt", "gte", "lte"].includes(filterSpecifier.op)
      ) {
        const attributeFilter = filterSpecifier;
        const field = this.serializeFieldParam(attributeFilter.attribute, {
          kind: "attribute",
        });
        params.push(
          `[{"name":"${field}","op":"${filterSpecifier.op}","val":"${filterSpecifier.value}"}]`
        );
      } else {
        params += super.buildFilterParam(filters, request);
      }
    });
    return params;
  }
}
const caterSource = new JSONAPISource({
  URLBuilderClass: FilterJSONAPIURLBuilder,
  schema: caterVendor,
  name: "1BMkjSaBtyDLbtbanY18",
  host: "http://localhost:5000",
  namespace: "api/catering",
  defaultFetchSettings: {
    headers: {
      Authorization: "Bearer token",
    },
  },
});

const transportSource = new JSONAPISource({
  URLBuilderClass: FilterJSONAPIURLBuilder,
  schema: transportVendor,
  name: "AF8iRt7qkZfQ1cAj1D6z",
  host: "http://localhost:5000",
  namespace: "api/transport",
  defaultFetchSettings: {
    headers: {
      Authorization: "Bearer token",
    },
  },
});

const venueSource = new JSONAPISource({
  URLBuilderClass: FilterJSONAPIURLBuilder,
  schema: venueVendor,
  name: "PQSwnqknalhyBW8qPB2a",
  host: "http://localhost:5000",
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
