from flask import Blueprint
from .models import populate_database


bp = Blueprint("apiBP", "api", url_prefix="/api")


@bp.get("/populate_db")
def home():
    return populate_database()
