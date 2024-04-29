from flask import Blueprint, request
from .decorators import validate_firebase_id_token
from firebase_admin import firestore

bp = Blueprint("car_api", __name__)
db = firestore.client()
car_ref = db.collection("cars").document("2RytJGa3wC7pGNwvfIep")

@bp.get("")
def api():
    
    car = db.collection("cars").limit(1).get()
    return car

@bp.get("/hello")
@validate_firebase_id_token
def hello():
    return "Hello {}".format(request.user["name"])
