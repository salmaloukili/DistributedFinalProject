import { RecordSchema } from "@orbit/records";

const base = {
  attributes: {
    created_at: { type: "datetime" },
    modified_at: { type: "datetime" },
  },
};

const venueVendor = new RecordSchema({
  models: {
    Venue: {
      attributes: {
        name: { type: "string" },
        location: { type: "string" },
        capacity: { type: "number" },
        ...base.attributes,
      },
      relationships: {
        events: { kind: "hasMany", type: "Event", inverse: "venue" },
      },
    },
    Event: {
      attributes: {
        max_price: { type: "number" },
        name: { type: "string" },
        date: { type: "datetime" },
        ...base.attributes,
      },
      relationships: {
        venue: { kind: "hasOne", type: "Venue", inverse: "events" },
        tickets: { kind: "hasMany", type: "Ticket", inverse: "event" },
      },
    },
    Ticket: {
      attributes: {
        price: { type: "number" },
        sold_date: { type: "datetime" },
        status: { type: "string" },
        ...base.attributes,
      },
      relationships: {
        event: { kind: "hasOne", type: "Event", inverse: "tickets" },
      },
    },
  },
});

const caterVendor = new RecordSchema({
  models: {
    Dinner: {
      attributes: {
        name: { type: "string" },
        ...base.attributes,
      },
      relationships: {
        menus: { kind: "hasMany", type: "Menu", inverse: "dinner" },
      },
    },
    Menu: {
      attributes: {
        item: { type: "string" },
        price: { type: "number" },
        ...base.attributes,
      },
      relationships: {
        dinner: { kind: "hasOne", type: "Dinner", inverse: "menus" },
        meals: { kind: "hasMany", type: "Meal", inverse: "menu" },
      },
    },
    Meal: {
      attributes: {
        meal_date: { type: "datetime" },
        status: { type: "string" },
        ...base.attributes,
      },
      relationships: {
        menu: { kind: "hasOne", type: "Menu", inverse: "meals" },
      },
    },
  },
});

const transportVendor = new RecordSchema({
  models: {
    Bus: {
      attributes: {
        model: { type: "string" },
        capacity: { type: "number" },
        ...base.attributes,
      },
      relationships: {
        schedules: { kind: "hasMany", type: "Schedule", inverse: "bus" },
      },
    },
    Schedule: {
      attributes: {
        departure_time: { type: "datetime" },
        arrival_time: { type: "datetime" },
        destination: { type: "string" },
        ...base.attributes,
      },
      relationships: {
        bus: { kind: "hasOne", type: "Bus", inverse: "schedules" },
        seats: { kind: "hasMany", type: "Seat", inverse: "schedule" },
      },
    },
    Seat: {
      attributes: {
        price: { type: "number" },
        sold_date: { type: "datetime" },
        status: { type: "string" },
        ...base.attributes,
      },
      relationships: {
        schedule: { kind: "hasOne", type: "Schedule", inverse: "seats" },
      },
    },
  },
});

export { venueVendor, caterVendor, transportVendor };