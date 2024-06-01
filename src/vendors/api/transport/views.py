from flask import Blueprint
from .models import populate_database


bp = Blueprint(
    "transportBP",
    "transport",
    url_prefix="/transport",
    static_url_path="api/transport/static",
)


@bp.get("/populate_db")
def home():
    return populate_database()
