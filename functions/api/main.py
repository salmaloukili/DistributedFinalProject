from firebase_functions import https_fn
from firebase_admin import initialize_app
from flask import Flask

initialize_app()

app = Flask(__name__)


@https_fn.on_request(region="europe-west1")
def flask_api(req: https_fn.Request) -> https_fn.Response:
    """
    This is the main entrypoint of the API. It makes
    flask handle all the incoming requests. flask is used
    since the Firebase HTTP library is not that feature rich.

    Args:
        req (https_fn.Request): The request from the server.

    Returns:
        https_fn.Response: The response from flask.
    """
    with app.request_context(req.environ):
        return app.full_dispatch_request()


with app.app_context():
    """
    This ensures the context is injected to any other 
    files containing flask functions that require it.
    """
    from application import cars_bp, api_bp

    # Dependency inversion to handle the API endpoints.
    api_bp.register_blueprint(cars_bp, url_prefix="/cars")
    app.register_blueprint(api_bp, url_prefix="/api")
