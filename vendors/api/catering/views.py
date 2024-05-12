from flask import Blueprint
from .models import populate_database


bp = Blueprint("cateringBP", "catering", url_prefix="/catering")


@bp.get("/populate_db")
def home():
    return populate_database()
     