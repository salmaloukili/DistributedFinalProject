from flask_httpauth import HTTPTokenAuth
from vendors.api.models import fake
import os

auth = HTTPTokenAuth()

secret_token = fake.password(40, False, True, True, True)
os.environ["VENDOR_SECRET_TOKEN"] = secret_token


@auth.verify_token
def verify_token(token):
    return token == secret_token
