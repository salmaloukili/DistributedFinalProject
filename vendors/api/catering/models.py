import random
from safrs import SAFRSFormattedResponse, ValidationError, jsonapi_rpc
from ..models import db, fake, FunctionDefault, BaseModel


class Dinner(BaseModel):
    __tablename__ = "dinners"
    id = db.Column(db.Integer, primary_key=True)
    name = FunctionDefault(db.String(100), default=fake.catch_phrase)
    menu = db.relationship("Menu", back_populates="dinner")


class Menu(BaseModel):
    __tablename__ = "menus"
    id = db.Column(db.Integer, primary_key=True)
    dinner_id = db.Column(db.Integer, db.ForeignKey("dinners.id"), nullable=False)
    dinner = db.relationship("Dinner", back_populates="menu")
    reservation = db.relationship("Reservation", back_populates="menu")

    item = FunctionDefault(db.String(100), default=fake.catch_phrase)
    price = FunctionDefault(
        db.DECIMAL(7, 2), default=lambda: round(random.uniform(20, 200), 2)
    )


class Reservation(BaseModel):
    __tablename__ = "reservations"
    http_methods = ["get", "delete"]

    id = db.Column(db.Integer, primary_key=True)
    customer_id = FunctionDefault(db.String(100), default=fake.uuid4, nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey("menus.id"), nullable=False)
    menu = db.relationship("Menu", back_populates="reservation")
    reservation_date = FunctionDefault(
        db.Date, default=lambda: fake.date_between(start_date="-1y", end_date="today")
    )


def populate_database():
    for _ in range(0, random.randint(4, 6)):
        dinner = Dinner()
        for _ in range(0, random.randint(9, 20)):
            menu = Menu(dinner_id=dinner.id)
            for _ in range(0, random.randint(0, 20)):
                Reservation(menu_id=menu.id)
    return "Success"


models = [Dinner, Menu, Reservation]
