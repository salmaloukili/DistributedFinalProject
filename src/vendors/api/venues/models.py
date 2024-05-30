import random
from safrs import SAFRSFormattedResponse, ValidationError, jsonapi_attr
from flask_security.utils import hash_password
from ..models import db, fake, FunctionDefault, BaseModel
import datetime


class Venue(BaseModel):
    __tablename__ = "venues"
    http_methods = ["get", "options"]

    id = db.Column(db.Integer, primary_key=True)
    name = FunctionDefault(db.String(100), default=fake.company)
    location = FunctionDefault(db.String(200), default=fake.address)
    capacity = FunctionDefault(db.Integer, default=lambda: random.randint(50, 500))
    event = db.relationship("Event", back_populates="venue")


class Event(BaseModel):
    __tablename__ = "events"
    http_methods = ["get", "options"]

    id = db.Column(db.Integer, primary_key=True)
    venue_id = db.Column(db.Integer, db.ForeignKey("venues.id"), nullable=False)
    venue = db.relationship("Venue", back_populates="event")
    ticket = db.relationship("Ticket", back_populates="event")

    max_price = FunctionDefault(db.Float, default=lambda: random.randint(50, 100))
    name = FunctionDefault(db.String(100), default=fake.catch_phrase)
    date = FunctionDefault(
        db.Date, default=lambda: fake.date_between(start_date="-1m", end_date="+1m")
    )

    @jsonapi_attr
    def price(self):
        venue: Venue = Venue.query.filter(Venue.id == self.venue_id).one()
        ticket_count = Ticket.query.filter(Ticket.event_id == self.id).count()
        price = round(self.max_price * ((ticket_count + 1) / (venue.capacity)))

        return price


class Ticket(BaseModel):
    __tablename__ = "tickets"
    id = db.Column(db.Integer, primary_key=True)
    user_id = FunctionDefault(db.String(100), default=fake.uuid4, nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    event = db.relationship("Event", back_populates="ticket")
    price = FunctionDefault(
        db.DECIMAL(7, 2), default=lambda: round(random.uniform(20, 200), 2)
    )
    sold_date = FunctionDefault(
        db.Date, default=lambda: fake.date_between(start_date="-1y", end_date="today")
    )
    status = FunctionDefault(
        db.String(100),
        default=lambda: random.choice(["reserved", "bought"]),
        nullable=False,
    )

    @classmethod
    def _s_post(cls, *args, **kwargs):
        print(kwargs)
        event: Event = Event.query.get(kwargs["event_id"])
        if not event:
            raise ValidationError("Wrong event_id")
        venue: Venue = Venue.query.get(event.venue_id)
        ticket_count = Ticket.query.filter(Ticket.event == event).count()
        if not venue or venue.capacity < ticket_count:
            raise ValidationError("No more space in venue.")

        result = cls(*args, **kwargs)
        return result


def populate_database():
    for _ in range(0, random.randint(2, 4)):
        venue = Venue()
        for _ in range(0, random.randint(2, 8)):
            event = Event(venue_id=venue.id)
            for _ in range(0, random.randint(0, round(venue.capacity / 2))):
                Ticket(event_id=event.id)
    return "Success"


models = [Event, Ticket, Venue]
