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
import { db, getRef } from "../firebase";

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
interface VendorSecret {
  VENDOR_COMPANY_NAME: string;
  VENDOR_COMPANY_TYPE: string;
  VENDOR_NUMBER: number;
  VENDOR_SECRET_TOKEN: string;
  VENDOR_NAME: string;
  VENDOR_URL: string;
}

function buildJSONSource(secret: VendorSecret, schema, namespace) {
  try {
    getRef("vendors").doc(secret.VENDOR_NAME).set({
      name: secret.VENDOR_COMPANY_NAME,
      type: secret.VENDOR_COMPANY_TYPE,
      number: secret.VENDOR_NUMBER,
      token: secret.VENDOR_SECRET_TOKEN,
      url: secret.VENDOR_URL,
    });
  } catch (error) {
    console.log(error);
  }

  return new JSONAPISource({
    URLBuilderClass: FilterJSONAPIURLBuilder,
    schema: schema,
    name: secret.VENDOR_NAME,
    host: secret.VENDOR_URL,
    namespace: "api/" + namespace,
    defaultFetchSettings: {
      timeout: 10000,
      headers: {
        Authorization: "Bearer " + secret.VENDOR_SECRET_TOKEN,
      },
    },
  });
}
const vendors: VendorSecret[] = [
  {
    VENDOR_COMPANY_NAME: "Geens-Martens NV",
    VENDOR_COMPANY_TYPE: "Venue",
    VENDOR_NUMBER: "14",
    VENDOR_SECRET_TOKEN: "dMrkUfGcUHF7zH7APgaQyANsSPpFORSUZUGR1Pz1",
    VENDOR_NAME: "indistvendor-14",
    VENDOR_URL: "https://indistvendor-14.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Neirynck CommV",
    VENDOR_COMPANY_TYPE: "Transport",
    VENDOR_NUMBER: "13",
    VENDOR_SECRET_TOKEN: "k8fRACWFSbO8URECM4exOiv28npd9PrtnCqNi8y7",
    VENDOR_NAME: "indistvendor-13",
    VENDOR_URL: "https://indistvendor-13.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Lauwers, Willems en Blondeel NV",
    VENDOR_COMPANY_TYPE: "Transport",
    VENDOR_NUMBER: "15",
    VENDOR_SECRET_TOKEN: "CXcmq1W9rtP4ivIv1XV4JAcNTrmkpG8aO0Gy53R3",
    VENDOR_NAME: "indistvendor-15",
    VENDOR_URL: "https://indistvendor-15.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "De Graeve CommV",
    VENDOR_COMPANY_TYPE: "Transport",
    VENDOR_NUMBER: "11",
    VENDOR_SECRET_TOKEN: "F8V1Y66I41gDv3NhQZCCKJ0Pv8h0SUgBVzlPNwz0",
    VENDOR_NAME: "indistvendor-11",
    VENDOR_URL: "https://indistvendor-11.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "De Mulder-Deconinck VOF",
    VENDOR_COMPANY_TYPE: "Transport",
    VENDOR_NUMBER: "12",
    VENDOR_SECRET_TOKEN: "ysYR5bfTbXd5BmGwrNJFKNZlBNr21f2C9kD4GQUb",
    VENDOR_NAME: "indistvendor-12",
    VENDOR_URL: "https://indistvendor-12.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Coppens VOF",
    VENDOR_COMPANY_TYPE: "Transport",
    VENDOR_NUMBER: "19",
    VENDOR_SECRET_TOKEN: "XjnOyc6h0ST7TVMtr6F1N7hG7HPHSIf2Cgk64Ve0",
    VENDOR_NAME: "usdistvendor-19",
    VENDOR_URL: "https://usdistvendor-19.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Thys-Peeters BV",
    VENDOR_COMPANY_TYPE: "Catering",
    VENDOR_NUMBER: "18",
    VENDOR_SECRET_TOKEN: "9gd9CgRPT7haXLopX5994SXqudnogWz8gsToBPGO",
    VENDOR_NAME: "usdistvendor-18",
    VENDOR_URL: "https://usdistvendor-18.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Moons NV",
    VENDOR_COMPANY_TYPE: "Transport",
    VENDOR_NUMBER: "20",
    VENDOR_SECRET_TOKEN: "0qZ3ncHhKiuvGp9Ph77mQwu3BAA5mIonfOSIipAw",
    VENDOR_NAME: "usdistvendor-20",
    VENDOR_URL: "https://usdistvendor-20.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Wuyts BV",
    VENDOR_COMPANY_TYPE: "Catering",
    VENDOR_NUMBER: "17",
    VENDOR_SECRET_TOKEN: "LxNmrEYxWMGYBbYY8euJKuZG00LSGdjJ4zu1YxOj",
    VENDOR_NAME: "usdistvendor-17",
    VENDOR_URL: "https://usdistvendor-17.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "De Cock NV",
    VENDOR_COMPANY_TYPE: "Venue",
    VENDOR_NUMBER: "16",
    VENDOR_SECRET_TOKEN: "WE9IS4hj0aUuTnSc118EPMXeOZVxmeoE6570cu7g",
    VENDOR_NAME: "usdistvendor-16",
    VENDOR_URL: "https://usdistvendor-16.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "De Moor CommV",
    VENDOR_COMPANY_TYPE: "Catering",
    VENDOR_NUMBER: "5",
    VENDOR_SECRET_TOKEN: "1PjGKoaah4MIhBTAFwMMPYPNqSh3x7FoSVtFSamM",
    VENDOR_NAME: "eudistvendor-5",
    VENDOR_URL: "https://eudistvendor-5.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Van Hulle CV",
    VENDOR_COMPANY_TYPE: "Transport",
    VENDOR_NUMBER: "2",
    VENDOR_SECRET_TOKEN: "julmLyx9kiSWUvVpLstSZvinDKhAuGuJ7hVWeaJZ",
    VENDOR_NAME: "eudistvendor-2",
    VENDOR_URL: "https://eudistvendor-2.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Verlinden, Mertens en Heylen CV",
    VENDOR_COMPANY_TYPE: "Transport",
    VENDOR_NUMBER: "1",
    VENDOR_SECRET_TOKEN: "6diIktyVxVuBRyuwOqTkPfMsmj5f6AqMjTJqcZeA",
    VENDOR_NAME: "eudistvendor-1",
    VENDOR_URL: "https://eudistvendor-1.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Devolder NV",
    VENDOR_COMPANY_TYPE: "Catering",
    VENDOR_NUMBER: "3",
    VENDOR_SECRET_TOKEN: "xRcIVNLaaugvrzfirGuZiDpZH3qz5nP97ls2c2iK",
    VENDOR_NAME: "eudistvendor-3",
    VENDOR_URL: "https://eudistvendor-3.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Delaere-Vranken VOF",
    VENDOR_COMPANY_TYPE: "Venue",
    VENDOR_NUMBER: "4",
    VENDOR_SECRET_TOKEN: "u8sqVPbQAIo22cHXTLJCaCdHMkJYu63ElcEKBS2h",
    VENDOR_NAME: "eudistvendor-4",
    VENDOR_URL: "https://eudistvendor-4.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Coenen-Van Looy VOF",
    VENDOR_COMPANY_TYPE: "Venue",
    VENDOR_NUMBER: "8",
    VENDOR_SECRET_TOKEN: "o8X2h9rSaRGrs9bWJMdUcJMHeoruXLuID2FIhPe7",
    VENDOR_NAME: "asdistvendor-8",
    VENDOR_URL: "https://asdistvendor-8.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Segers, Verdonck en Janssens VOF",
    VENDOR_COMPANY_TYPE: "Catering",
    VENDOR_NUMBER: "6",
    VENDOR_SECRET_TOKEN: "UpCZyUVudFQM7VglbGiNDbpsWBAe3fcNWHgUBaz5",
    VENDOR_NAME: "asdistvendor-6",
    VENDOR_URL: "https://asdistvendor-6.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Geens-Peeters VOF",
    VENDOR_COMPANY_TYPE: "Transport",
    VENDOR_NUMBER: "7",
    VENDOR_SECRET_TOKEN: "gGJaSInhFZWsjHy7Pk9U2fpZ9JhaZSqwTf3hezoH",
    VENDOR_NAME: "asdistvendor-7",
    VENDOR_URL: "https://asdistvendor-7.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Casteleyn, Faes en Vanhove CommV",
    VENDOR_COMPANY_TYPE: "Transport",
    VENDOR_NUMBER: "9",
    VENDOR_SECRET_TOKEN: "tq8Ejqx0lCqKt8uVZXC4Blh9wi2GgqkjZ0rONbVj",
    VENDOR_NAME: "asdistvendor-9",
    VENDOR_URL: "https://asdistvendor-9.azurewebsites.net",
  },
  {
    VENDOR_COMPANY_NAME: "Callens VOF",
    VENDOR_COMPANY_TYPE: "Transport",
    VENDOR_NUMBER: "10",
    VENDOR_SECRET_TOKEN: "RT5KVqyE1Ib4v5Nwu9xlVrBLyRg8WrGIewAAlKDX",
    VENDOR_NAME: "asdistvendor-10",
    VENDOR_URL: "https://asdistvendor-10.azurewebsites.net",
  },
];

let caterSources = [];
let transportSources = [];
let venueSources = [];

for (const vendor of vendors) {
  switch (vendor.VENDOR_COMPANY_TYPE) {
    case "Venue":
      venueSources.push(buildJSONSource(vendor, venueVendor, "venues"));
      break;
    case "Transport":
      transportSources.push(
        buildJSONSource(vendor, transportVendor, "transport")
      );
      break;
    case "Catering":
      caterSources.push(buildJSONSource(vendor, caterVendor, "catering"));
      break;
    default:
      break;
  }
}
const sources = {
  catering: caterSources,
  transport: transportSources,
  venues: venueSources,
};
export default sources;
