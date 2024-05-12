import random
from safrs import SAFRSFormattedResponse, ValidationError, jsonapi_rpc
from ..models import db, fake, FunctionDefault, BaseModel


class Venue(BaseModel):
    __tablename__ = "venues"
    id = db.Column(db.Integer, primary_key=True)
    name = FunctionDefault(db.String(100), default=fake.company)
    location = FunctionDefault(db.String(200), default=fake.address)
    capacity = FunctionDefault(db.Integer, default=lambda: random.randint(50, 500))
    event = db.relationship("Event", back_populates="venue")


class Event(BaseModel):
    __tablename__ = "events"
    id = db.Column(db.Integer, primary_key=True)
    venue_id = db.Column(db.Integer, db.ForeignKey("venues.id"), nullable=False)
    venue = db.relationship("Venue", back_populates="event")
    ticket = db.relationship("Ticket", back_populates="event")

    max_price = FunctionDefault(db.Float, default=lambda: random.randint(50, 100))
    name = FunctionDefault(db.String(100), default=fake.catch_phrase)
    date = FunctionDefault(
        db.Date, default=lambda: fake.date_between(start_date="-1y", end_date="today")
    )

    @jsonapi_rpc(http_methods=["POST"])
    def buy_ticket(self, user_id: str):
        """
        pageable: false
        args:
            user_id: The Firebase user ID
        """
        capacity = Venue.query.get(self.venue_id).capacity
        ticket_count = Ticket.query.count()

        if capacity > ticket_count:
            raise ValidationError("Event is fully booked.")

        ticket = Ticket(user_id=user_id, event_id=self.id, price=self.max_price)

        self.max_price = round(self.max_price * (capacity / ticket_count))
        return SAFRSFormattedResponse(ticket)


class Ticket(BaseModel):
    __tablename__ = "tickets"
    http_methods = ["get", "delete"]

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


def populate_database():
    for _ in range(0, random.randint(4, 6)):
        venue = Venue()
        for _ in range(0, random.randint(9, 20)):
            event = Event(venue_id=venue.id)
            for _ in range(0, random.randint(0, round(venue.capacity / 2))):
                Ticket(event_id=event.id)
    return "Success"


models = [Event, Ticket, Venue]
