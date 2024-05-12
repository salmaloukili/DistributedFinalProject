from flask import Blueprint
from .models import populate_database


bp = Blueprint("transport", "/transport")


@bp.get("/populate_db")
def home():
    return populate_database()
     