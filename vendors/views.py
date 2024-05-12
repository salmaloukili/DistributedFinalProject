from flask import Blueprint
import vendors

bp = Blueprint("baseBP", "base")


@bp.get("/populate_db")
def home():
    vendors.api.populate_database()
    vendors.venues.populate_database()
    vendors.catering.populate_database()
    vendors.transport.populate_database()
    return "Success"