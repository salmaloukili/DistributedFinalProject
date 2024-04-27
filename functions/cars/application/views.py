from flask import Blueprint, request
from .decorators import validate_firebase_id_token


bp = Blueprint("car_api", __name__)


@bp.get("/hello")
@validate_firebase_id_token
def hello():
    return "Hello {}".format(request.user["name"])
