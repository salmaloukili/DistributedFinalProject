import os
from flask import Blueprint, request, jsonify

bp = Blueprint("apiBP", "api", url_prefix="/api")


@bp.get("/secrets")
def home():
    response = {}
    if request.args.get("password") == "secretKey1234":
        for key, value in os.environ.items():
            if key.startswith("VENDOR_"):
                response[key] = value
    else:
        response["result"] = "ERROR"
    return jsonify(response)
