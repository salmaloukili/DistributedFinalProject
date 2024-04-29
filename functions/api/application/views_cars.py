from flask import Blueprint, request
from .utils import get_next_prev
from .schema import car_schema, cars_schema
from firebase_admin import firestore


bp = Blueprint("car", __name__)

db = firestore.client()
car_ref = db.collection("cars")


@bp.get("/")
def get_cars() -> list[dict]:
    """
    Gets all the cars and returns them through the schema.
    Each car object gets a self URL to get its full data.

    Returns:
        list[dict]: The serialized cars.
    """
    sort = request.args.get("sort")

    if sort not in cars_schema.Meta.fields:
        sort = cars_schema.Meta.fields[0]

    cars = car_ref.order_by(sort).get()

    return cars_schema.dump(cars)


@bp.get("/<id>")
def get_car(id: str) -> dict:
    """
    API endpoint to get a single car, with all the HATEOAS
    unnecessary fluff.
    
    Args:
        id (str): The Firebase ID for the car.
    Returns:
        dict: Serialized object.
    """
    sort = request.args.get("sort")

    # If no sort requested simply use any, this is required to
    # get the next and previous objects since Firebase cannot
    # sort the ID in descending order.
    if sort not in car_schema.Meta.fields:
        sort = car_schema.Meta.fields[0]

    return car_schema.dump(*get_next_prev(id, car_ref, sort))
