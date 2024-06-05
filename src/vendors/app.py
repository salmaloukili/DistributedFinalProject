import os
from flask import Flask
from . import init_app, setup_database
from vendors.api import populate_database


def create_app(test_config=None):
    app = Flask(__name__)

    app.config.from_pyfile("config.py", silent=True)

    init_app(app)
    setup_database(app)

    for key, value in os.environ.items():
        if key.startswith("VENDOR_"):
            print(f"{key}={value}\n")

    @app.after_request
    def after_request(response):
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        )
        return response

    with app.app_context():
        populate_database()
    return app
