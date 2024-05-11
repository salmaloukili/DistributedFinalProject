from flask_admin.contrib.sqla import ModelView
from flask_admin import Admin
from flask import Flask
from safrs import SafrsApi


def create_app():
    from .views import bp

    app = Flask(__name__)
    app.config["DEBUG"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///sqlite.db"
    app.register_blueprint(bp)
    return app


def setup_database(app):
    from .models import db, models

    with app.app_context():
        db.init_app(app)
        db.create_all()
        admin = Admin(app, name="microblog", template_mode="bootstrap3")

        api = SafrsApi(app, host="127.0.0.1", prefix="/api")

        for model in models:
            admin.add_view(ModelView(model, db.session))
            api.expose_object(model)
