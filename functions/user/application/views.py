from flask import Blueprint

bp = Blueprint("car_api", __name__)


@bp.get("/hello")
def hello():
    return "Hello"
