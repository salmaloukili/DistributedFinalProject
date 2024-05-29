import { RecordSchema } from "@orbit/records";
const base = {
  Employee: {
    attributes: {
      first_name: { type: "string" },
      last_name: { type: "string" },
      email: { type: "string" },
      privileges: { type: "string" },
      hire_date: { type: "date" },
      salary: { type: "number" },
      created_at: { type: "datetime" },
      modified_at: { type: "datetime" },
    },
  },
  Role: {
    attributes: {
      created_at: { type: "datetime" },
      modified_at: { type: "datetime" },
    },
  },
};

const venueVendor = new RecordSchema({
  models: {
    ...base,
    Venues: {
      attributes: {},
    },
  },
});

const caterVendor = new RecordSchema({
  models: {
    ...base,
    Venues: {
      attributes: {},
    },
  },
});

const transportVendor = new RecordSchema({
  models: {
    ...base,
    Venues: {
      attributes: {},
    },
  },
});

export { venueVendor, caterVendor, transportVendor };
