from flask import Blueprint, send_file
from .models import populate_database


bp = Blueprint(
    "venuesBP",
    "venues",
    url_prefix="/venues",
    static_url_path="api/venues/static",
)


@bp.get("/populate_db")
def home():
    return populate_database()
