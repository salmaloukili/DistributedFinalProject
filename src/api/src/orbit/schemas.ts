import { RecordSchema } from "@orbit/records";

const base = {
  attributes: {
    created_at: { type: "datetime", validation: { required: false } },
    modified_at: { type: "datetime", validation: { required: false } },
    removed: { type: "boolean" },
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
        genre: { type: "string" },
        date: { type: "date" },
        price: { type: "number" },
        image_url: { type: "string" },
        venue_id: { type: "number" },
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
        sold_date: { type: "date" },
        status: { type: "string" },
        user_id: { type: "string" },
        event_id: { type: "number" },
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
    Menu: {
      attributes: {
        food: { type: "string" },
        description: { type: "string" },
        drink: { type: "string" },
        limit: { type: "number" },
        price: { type: "number" },
        image_url: { type: "string" },
        ...base.attributes,
      },
      relationships: {
        meals: { kind: "hasMany", type: "Meal", inverse: "menu" },
      },
    },
    Meal: {
      attributes: {
        meal_date: { type: "date" },
        status: { type: "string" },
        user_id: { type: "string" },
        menu_id: { type: "number" },
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
        image_url: { type: "string" },
        ...base.attributes,
      },
      relationships: {
        schedules: { kind: "hasMany", type: "Schedule", inverse: "bus" },
      },
    },
    Schedule: {
      attributes: {
        departure_date: { type: "date" },
        origin: { type: "string" },
        price: { type: "number" },
        bus_id: { type: "number" },
        ...base.attributes,
      },
      relationships: {
        bus: { kind: "hasOne", type: "Bus", inverse: "schedules" },
        seats: { kind: "hasMany", type: "Seat", inverse: "schedule" },
      },
    },
    Seat: {
      attributes: {
        sold_date: { type: "date" },
        status: { type: "string" },
        user_id: { type: "string" },
        schedule_id: { type: "number" },
        ...base.attributes,
      },
      relationships: {
        schedule: { kind: "hasOne", type: "Schedule", inverse: "seats" },
      },
    },
  },
});

export { venueVendor, caterVendor, transportVendor };
