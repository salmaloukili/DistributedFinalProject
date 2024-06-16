from flask_httpauth import HTTPTokenAuth
import os

auth = HTTPTokenAuth()


@auth.verify_token
def verify_token(token):
    return token == (os.environ.get("VENDOR_SECRET_TOKEN") or "token")
