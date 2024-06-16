// @ts-nocheck
import JSONAPISource, {
  JSONAPIURLBuilder,
  RecordQueryRequest,
  RecordTransformRequest,
} from "@orbit/jsonapi";

import { caterVendor, transportVendor, venueVendor } from "./schemas";
import { FilterSpecifier } from "@orbit/records";
import { Dict } from "@orbit/utils";
import { env } from "node:process";
import { db, getRef, vendorRef } from "../firebase";

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

function buildJSONSource(vendor, schema, namespace) {
  return new JSONAPISource({
    URLBuilderClass: FilterJSONAPIURLBuilder,
    schema: schema,
    name: vendor.id,
    host: vendor.url,
    namespace: "api/" + namespace,
    defaultFetchSettings: {
      timeout: 10000,
      headers: {
        Authorization: "Bearer " + vendor.token,
      },
    },
  });
}

export default {
  venues: vendorRef
    .where("type", "==", "Venue")
    .get()
    .then((r) =>
      r.docs.map((d) =>
        buildJSONSource({ id: d.id, ...d.data() }, venueVendor, "venues")
      )
    ),
  transport: vendorRef
    .where("type", "==", "Transport")
    .get()
    .then((r) =>
      r.docs.map((d) =>
        buildJSONSource({ id: d.id, ...d.data() }, transportVendor, "transport")
      )
    ),
  catering: vendorRef
    .where("type", "==", "Catering")
    .get()
    .then((r) =>
      r.docs.map((d) =>
        buildJSONSource({ id: d.id, ...d.data() }, caterVendor, "catering")
      )
    ),
};
