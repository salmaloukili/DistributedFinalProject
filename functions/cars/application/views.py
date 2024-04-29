from flask import Blueprint, abort, request

from .schema import CarSchema, CarsSchema
from .decorators import validate_firebase_id_token
from firebase_admin import firestore
from google.cloud.firestore_v1.field_path import FieldPath 
bp = Blueprint("car_api", __name__)
db = firestore.client()
car_ref = db.collection("cars")

car_schema = CarSchema()
cars_schema = CarsSchema(many=True)


@bp.get("/")
def cars():
    sort = request.args.get("sort")

    if sort not in cars_schema.Meta.fields:
        sort = cars_schema.Meta.fields[0]

    cars = car_ref.order_by(sort).get()
    
    return cars_schema.dump(cars)


@bp.get("/<id>")
def car_detail(id: str):
    sort = request.args.get("sort")
    car = car_ref.document(id).get()

    if not car.exists:
        return abort(404)

    if sort not in car_schema.Meta.fields:
        sort = car_schema.Meta.fields[0]
    
    next = car_ref.order_by(sort)
    prev = car_ref.order_by(sort, direction=firestore.Query.DESCENDING)
    
    try:
        next = next.start_at(car).limit(2).get()[1].id
    except IndexError:
        next = None
    try:
        prev = prev.start_at(car).limit(2).get()[1].id
    except IndexError:
        prev = None

    return car_schema.dump(car, next, prev)
