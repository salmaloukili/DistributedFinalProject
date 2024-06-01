import random
from flask import Blueprint, send_file
from .api.models import fake
import vendors

bp = Blueprint(
    "baseBP",
    "base",
    static_url_path="static",
)

number = random.randint(1, 100)


@bp.get("/populate_db")
def populate_db():
    vendors.api.populate_database()
    vendors.venues.populate_database()
    vendors.catering.populate_database()
    vendors.transport.populate_database()
    return "Success"


@bp.route("/logo")
def get_image():
    return send_file(f"{bp.static_url_path}/{number}.webp", mimetype="image/gif")


@bp.get("/")
def home():
    return fake.company()
