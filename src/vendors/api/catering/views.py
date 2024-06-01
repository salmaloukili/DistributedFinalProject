from flask import Blueprint
from .models import populate_database


bp = Blueprint(
    "cateringBP",
    "catering",
    url_prefix="/catering",
    static_url_path="api/catering/static",
)


@bp.get("/populate_db")
def home():
    return populate_database()
