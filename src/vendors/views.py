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
vendor_number = os.environ.get("VENDOR_NUMBER")

if vendor_number and vendor_number != "0":
    logo_number = random.randint(1, 100)
else:
    logo_number = 0


@bp.route("/logo")
def get_image():
    return send_file(f"{bp.static_url_path}/{logo_number}.webp", mimetype="image/gif")


@bp.get("/")
def home():
    return os.environ["VENDOR_COMPANY_NAME"]
