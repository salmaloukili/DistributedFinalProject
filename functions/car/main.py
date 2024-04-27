from flask import Flask
from firebase_admin import initialize_app
from firebase_functions import https_fn
import application 

initialize_app()
app = Flask(__name__)

@https_fn.on_request()
def flask_car(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()
    
app.register_blueprint(application.bp, url_prefix='/api/car')
