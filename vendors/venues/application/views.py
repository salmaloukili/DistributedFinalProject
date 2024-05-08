from flask import Blueprint
from .models import employees, populate_database


bp = Blueprint("API", "")


@bp.get("/populate_db")
def home():
    
    populate_database()
    return employees.query.all()