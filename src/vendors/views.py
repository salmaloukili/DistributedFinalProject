import random
from flask import Blueprint, send_file
from .api.models import fake
import vendors
import os

bp = Blueprint(
    "baseBP",
    "base",
    static_url_path="static",
)

logo_number = random.randint(1, 100)


@bp.route("/logo")
def get_image():
    return send_file(f"{bp.static_url_path}/{logo_number}.webp", mimetype="image/gif")


@bp.get("/")
def home():
    return os.environ["VENDOR_COMPANY_NAME"]
