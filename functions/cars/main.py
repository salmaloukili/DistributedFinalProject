from flask import Flask
from firebase_functions import https_fn
from firebase_admin import initialize_app

initialize_app()

app = Flask(__name__)

with app.app_context():
    import application
    app.register_blueprint(application.bp, url_prefix="/api/cars")


@https_fn.on_request(region="europe-west1")
def flask_cars(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()
