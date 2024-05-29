from flask import Blueprint
from .api.models import fake
import vendors

bp = Blueprint("baseBP", "base")


@bp.get("/populate_db")
def populate_db():
    vendors.api.populate_database()
    vendors.venues.populate_database()
    vendors.catering.populate_database()
    vendors.transport.populate_database()
    return "Success"

@bp.get("/")
def home():
    return fake.company()