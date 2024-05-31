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
    const params = [];
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
  URLBuilderClass: FilterJSONAPIURLBuilder,
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
  URLBuilderClass: FilterJSONAPIURLBuilder,
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
