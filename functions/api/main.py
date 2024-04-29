from firebase_functions import https_fn
from firebase_admin import initialize_app
from flask import Flask

initialize_app()

app = Flask(__name__)


@https_fn.on_request(region="europe-west1")
def flask_api(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()


with app.app_context():
    from application import cars_bp, api_bp

    api_bp.register_blueprint(cars_bp, url_prefix="/cars")
    app.register_blueprint(api_bp, url_prefix="/api")
