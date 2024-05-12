from flask import Blueprint
from .models import populate_database


bp = Blueprint("venues", "/venues")


@bp.get("/populate_db")
def home():
    return populate_database()
     