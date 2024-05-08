from flask import Flask
from safrs import SafrsApi
from .models import db, user


def create_app():
    from application import views

    app = Flask(__name__)
    app.config["DEBUG"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///sqlite.db"
    app.register_blueprint(views.bp)
    return app


def setup_database(app):
    with app.app_context():
        db.init_app(app)
        db.create_all()
        api = SafrsApi(app, prefix="/api")
        api.expose_object(user)
