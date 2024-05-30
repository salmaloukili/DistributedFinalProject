import datetime
import random

from safrs import SAFRSFormattedResponse, ValidationError, jsonapi_rpc
from ..models import db, fake, FunctionDefault, BaseModel


class Bus(BaseModel):
    __tablename__ = "buses"
    id = db.Column(db.Integer, primary_key=True)
    model = FunctionDefault(db.String(100), default=fake.company)
    capacity = FunctionDefault(db.Integer, default=lambda: random.randint(30, 60))
    schedule = db.relationship("Schedule", back_populates="bus")


class Schedule(BaseModel):
    __tablename__ = "schedules"
    id = db.Column(db.Integer, primary_key=True)
    bus_id = db.Column(db.Integer, db.ForeignKey("buses.id"), nullable=False)
    bus = db.relationship("Bus", back_populates="schedule")
    seat = db.relationship("Seat", back_populates="schedule")
    price = FunctionDefault(
        db.DECIMAL(7, 2), default=lambda: round(random.uniform(20, 200), 2)
    )

    departure_date = FunctionDefault(
        db.Date,
        default=lambda: fake.date_between(start_date="-30d", end_date="+30d"),
    )
    origin = FunctionDefault(db.String(100), default=fake.city)

    @jsonapi_rpc(http_methods=["POST"])
    def reserve_seat(self, user_id: str):
        """
        pageable: false
        args:
            user_id: The Firebase user ID
        """
        capacity = Bus.query.get(self.bus_id).capacity
        seat_count = Seat.query.filter(Schedule.id == self.id).count()

        if capacity > seat_count:
            raise ValidationError("Bus is fully booked.")

        ticket = Seat(
            user_id=user_id,
            event_id=self.id,
            price=self.price,
            sold_date=datetime.date.today(),
            status="reserved",
        )
        return SAFRSFormattedResponse(ticket)


class Seat(BaseModel):
    __tablename__ = "seats"
    http_methods = ["get", "delete", "patch"]

    id = db.Column(db.Integer, primary_key=True)
    passenger_id = FunctionDefault(db.String(100), default=fake.uuid4, nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey("schedules.id"), nullable=False)
    schedule = db.relationship("Schedule", back_populates="seat")
    sold_date = FunctionDefault(
        db.Date, default=lambda: fake.date_between(start_date="-1y", end_date="now")
    )
    status = FunctionDefault(
        db.String(100),
        default=lambda: random.choice(["reserved", "bought"]),
        nullable=False,
    )


def populate_database():
    for _ in range(0, random.randint(2, 4)):
        bus = Bus()
        for _ in range(0, random.randint(2, 8)):
            schedule = Schedule(bus_id=bus.id)
            for _ in range(0, random.randint(0, round(bus.capacity / 2))):
                Seat(schedule_id=schedule.id)
    return "Success"


models = [Bus, Schedule, Seat]
