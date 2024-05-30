import datetime
from email.policy import default
import random
from safrs import SAFRSFormattedResponse, ValidationError, jsonapi_rpc
from ..models import db, fake, FunctionDefault, BaseModel


class Menu(BaseModel):
    __tablename__ = "menus"
    id = db.Column(db.Integer, primary_key=True)
    meal = db.relationship("Meal", back_populates="menu")
    limit = FunctionDefault(db.Integer, default=lambda: random.randint(30, 60))
    food = FunctionDefault(db.String(100), default=fake.catch_phrase)
    drink = FunctionDefault(db.String(100), default=fake.catch_phrase)
    price = FunctionDefault(
        db.DECIMAL(7, 2), default=lambda: round(random.uniform(20, 200), 2)
    )

    @jsonapi_rpc(http_methods=["POST"])
    def reserve_meal(self, user_id: str):
        """
        pageable: false
        args:
            user_id: The Firebase user ID
        """
        seat_count = Meal.query.filter(Menu.id == self.id).count()

        if self.limit > seat_count:
            raise ValidationError("Bus is fully booked.")

        ticket = Meal(
            user_id=user_id,
            event_id=self.id,
            price=self.price,
            sold_date=datetime.date.today(),
            status="reserved",
        )
        return SAFRSFormattedResponse(ticket)


class Meal(BaseModel):
    __tablename__ = "meals"
    http_methods = ["get", "delete"]

    id = db.Column(db.Integer, primary_key=True)
    customer_id = FunctionDefault(db.String(100), default=fake.uuid4, nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey("menus.id"), nullable=False)
    menu = db.relationship("Menu", back_populates="meal")
    meal_date = FunctionDefault(
        db.Date, default=lambda: fake.date_between(start_date="-1m", end_date="+1m")
    )
    status = FunctionDefault(
        db.String(100),
        default=lambda: random.choice(["reserved", "bought"]),
        nullable=False,
    )


def populate_database():
    for _ in range(0, random.randint(4, 8)):
        menu = Menu()
        for _ in range(0, random.randint(0, 10)):
            Meal(menu_id=menu.id)
    return "Success"


models = [ Menu, Meal]
