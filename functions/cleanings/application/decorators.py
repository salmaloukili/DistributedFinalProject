from functools import wraps
from firebase_admin import auth
from flask import jsonify, request


def validate_firebase_id_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        id_token = None
        if "Authorization" in request.headers and request.headers[
            "Authorization"
        ].startswith("Bearer "):
            id_token = request.headers["Authorization"].split("Bearer ")[1]
        elif "__session" in request.cookies:
            id_token = request.cookies["__session"]
        else:
            return jsonify({"message": "Unauthorized"}), 403

        try:
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token
        except Exception as e:
            return jsonify({"message": "Unauthorized: " + str(e)}), 403

        return f(*args, **kwargs)

    return decorated_function
