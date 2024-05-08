import random
from flask_sqlalchemy import SQLAlchemy
from safrs import SAFRSBase
import datetime
from faker import Faker

fake = Faker()
db = SQLAlchemy()

random.seed(1)
Faker.seed(1)


class TimeColumn(db.Column):
    def utcnow():
        return

    sample = utcnow()
    default = utcnow


def FunctionDefault(col, **kwargs):
    _sample = None
    try:
        _sample = kwargs["default"]()
    except (KeyError, TypeError):
        print("FunctionDefault: Default is not a function or not found.")

    cls = type(f"Column_{col}_{_sample}", (db.Column,), dict(sample=_sample))
    return cls(col, **kwargs)


class BaseModel(SAFRSBase, db.Model):
    __abstract__ = True
    created_at = FunctionDefault(
        db.DateTime,
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
    )
    modified_at = FunctionDefault(
        db.DateTime,
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc),
    )


class employees(BaseModel):
    __tablename__ = "employees"
    id = db.Column(db.Integer, primary_key=True)
    first_name = FunctionDefault(db.String(50), default=fake.first_name)
    last_name = FunctionDefault(db.String(50), default=fake.last_name)
    email = FunctionDefault(db.String(120), default=fake.email)
    privileges = FunctionDefault(db.String(50), default=fake.job)
    hire_date = FunctionDefault(
        db.Date, default=lambda: fake.date_between(start_date="-10y", end_date="today")
    )
    salary = FunctionDefault(
        db.DECIMAL(7, 2), default=lambda: round(random.uniform(30000, 100000), 2)
    )


class venues(BaseModel):
    __tablename__ = "venues"
    id = db.Column(db.Integer, primary_key=True)
    name = FunctionDefault(db.String(100), default=fake.catch_phrase)
    location = FunctionDefault(db.String(200), default=fake.address)
    capacity = FunctionDefault(db.Integer, default=lambda: random.randint(50, 500))
    events = db.relationship("events", back_populates="venues")



class events(BaseModel):
    __tablename__ = "events"
    id = db.Column(db.Integer, primary_key=True)
    venues_id = db.Column(db.Integer, db.ForeignKey("venues.id"), nullable=False)
    venues = db.relationship("venues", back_populates="events")
    tickets = db.relationship("tickets", back_populates="events")

    name = FunctionDefault(db.String(100), default=fake.catch_phrase)
    date = FunctionDefault(
        db.Date, default=lambda: fake.date_between(start_date="-1y", end_date="today")
    )



class tickets(BaseModel):
    __tablename__ = "tickets"
    id = db.Column(db.Integer, primary_key=True)
    events_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    events = db.relationship("events", back_populates="tickets")

    price = FunctionDefault(
        db.DECIMAL(7, 2), default=lambda: round(random.uniform(20, 200), 2)
    )
    sold_date = FunctionDefault(
        db.Date, default=lambda: fake.date_between(start_date="-1y", end_date="today")
    )


models = [employees, events, tickets, venues]


def populate_database():
    db.drop_all()
    db.create_all()
    for _ in range(0, 40):
        employees()

    for _ in range(0, random.randint(4, 6)):
        venue = venues()
        for _ in range(0, random.randint(9, 20)):
            event = events(venues_id=venue.id)
            for _ in range(0, random.randint(0, venue.capacity)):
                tickets(events_id=event.id)
