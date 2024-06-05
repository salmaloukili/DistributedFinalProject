import random
from safrs import ValidationError, jsonapi_attr
from ..models import db, fake, FunctionDefault, BaseModel


class Bus(BaseModel):
    __tablename__ = "buss"
    http_methods = ["get", "options"]
    id = db.Column(db.Integer, primary_key=True)
    model = FunctionDefault(db.String(100), default=fake.vehicle_year_make_model)
    capacity = FunctionDefault(db.Integer, default=lambda: random.randint(30, 60))
    schedules = db.relationship("Schedule", back_populates="bus")

    @jsonapi_attr
    def image_url(self):
        return f"/transport/img/{self.id%15}"


class Schedule(BaseModel):
    __tablename__ = "schedules"
    http_methods = ["get", "options"]
    id = db.Column(db.Integer, primary_key=True)
    bus_id = db.Column(db.Integer, db.ForeignKey("buss.id"), nullable=False)
    bus = db.relationship("Bus", back_populates="schedules")
    seats = db.relationship("Seat", back_populates="schedule")
    price = FunctionDefault(
        db.DECIMAL(7, 2), default=lambda: round(random.uniform(20, 200), 2)
    )

    departure_date = FunctionDefault(
        db.Date,
        default=lambda: fake.date_between(start_date="-30d", end_date="+30d"),
    )
    origin = FunctionDefault(db.String(100), default=fake.city)


class Seat(BaseModel):
    __tablename__ = "seats"
    id = db.Column(db.Integer, primary_key=True)
    user_id = FunctionDefault(db.String(100), default=fake.uuid4, nullable=False, unique=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey("schedules.id"), nullable=False)
    schedule = db.relationship("Schedule", back_populates="seats")
    sold_date = FunctionDefault(
        db.Date, default=lambda: fake.date_between(start_date="-1y", end_date="now")
    )
    status = FunctionDefault(
        db.String(100),
        default=lambda: random.choice(["reserved", "bought"]),
        nullable=False,
    )

    @classmethod
    def _s_post(cls, *args, **kwargs):
        print(kwargs)
        schedule: Schedule = Schedule.query.get(kwargs["schedule_id"])
        if not schedule:
            raise ValidationError("Wrong schedule_id")
        bus: Bus = Bus.query.get(schedule.bus_id)
        seat_count = Seat.query.filter(Seat.schedule == schedule).count()
        if not bus or bus.capacity < seat_count:
            raise ValidationError("No more space in bus.")

        result = cls(*args, **kwargs)
        return result


def populate_database():
    for _ in range(0, random.randint(1, 3)):
        bus = Bus()
        for _ in range(0, random.randint(2, 4)):
            schedule = Schedule(bus_id=bus.id)
            for _ in range(0, random.randint(0, round(bus.capacity / 4))):
                Seat(schedule_id=schedule.id)
    return "Success"


models = [Bus, Schedule, Seat]
