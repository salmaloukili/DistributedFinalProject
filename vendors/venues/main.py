from flask import Flask, jsonify, url_for
from flask_sqlalchemy import SQLAlchemy
from safrs import SAFRSBase, SafrsApi
from firebase_admin import initialize_app
from firebase_functions import https_fn

firebase_app = initialize_app()

db = SQLAlchemy()

class user(SAFRSBase, db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String)




def create_app():
    app = Flask(__name__)
    app.config.update(SQLALCHEMY_DATABASE_URI="sqlite:///sqlite.db")
    db.init_app(app)
    with app.app_context():
        db.create_all()
        api = SafrsApi(app, prefix="/api")
        api.expose_object(user)
    return app


app = create_app()


@app.route("/api/help", methods=["GET"])
def help():
    user(name="test", email="poopie@x.org")  # this will automatically commit the user!
    return jsonify(user.query.all())


# @app.get("/")
# def main():
#     return User.query.all()


# if __name__ == "__main__":
#     app.run()

 
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
