import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Index
import vendors.api.venues as venues
import vendors.api.transport as transport
import vendors.api.catering as catering
import vendors.api as api
import random
from .views import bp
from flask_security import Security
from flask_admin import Admin, helpers
from flask import url_for, send_file, Blueprint
from safrs import SafrsApi
from .auth import auth


def apply_route(blueprint: Blueprint):
    @blueprint.route("/img/<int:number>")
    def get_image(number: int):
        return send_file(
            f"{blueprint.static_url_path}/{number}.webp", mimetype="image/gif"
        )


def create_app(app):
    blueprints = [
        api.bp,
        venues.bp,
        catering.bp,
        transport.bp,
    ]

    for _bp in blueprints:
        apply_route(_bp)
        app.register_blueprint(_bp)
    app.register_blueprint(bp)


def create_index(model, db: SQLAlchemy):
    idx = Index("idx_modified_at" + model.__name__, model.__table__.c.modified_at)
    try:
        idx.create(bind=db.engine)
    except:
        return


def setup_database(app):

    with app.app_context():
        api.db.init_app(app)
        api.db.create_all()
        admin = Admin(
            app,
            "Example: Auth",
            base_template="my_master.html",
            template_mode="bootstrap4",
        )
        custom_swagger = {
            "securityDefinitions": {
                "Bearer": {
                    "type": "apiKey",
                    "in": "header",
                    "name": "Authorization",
                    "description": "Enter the token with the `Bearer: ` prefix, e.g. 'Bearer abcde12345'.",
                }
            },
            "security": [{"Bearer": []}],
        }
        security = Security(app, api.datastore)
        safrs = SafrsApi(
            app, host="127.0.0.1", prefix="/api", custom_swagger=custom_swagger
        )

        for model in api.models:
            admin.add_view(api.AdminModelView(model, api.db.session))
        company_type = random.choice(["Venue", "Transport", "Catering"])
        os.environ["VENDOR_COMPANY_TYPE"] = company_type

        match company_type:
            case "Transport":
                for model in transport.models:
                    create_index(model, api.db)
                    admin.add_view(api.AdminModelView(model, api.db.session))
                    safrs.expose_object(
                        model,
                        "/transport",
                        method_decorators=[auth.login_required],
                    )
            case "Venue":
                for model in venues.models:
                    create_index(model, api.db)
                    admin.add_view(api.AdminModelView(model, api.db.session))
                    safrs.expose_object(
                        model,
                        "/venues",
                        method_decorators=[auth.login_required],
                    )
            case "Catering":
                for model in catering.models:
                    create_index(model, api.db)
                    admin.add_view(api.AdminModelView(model, api.db.session))
                    safrs.expose_object(
                        model,
                        "/catering",
                        method_decorators=[auth.login_required],
                    )

        @security.context_processor
        def security_context_processor():
            return dict(
                admin_base_template=admin.base_template,
                admin_view=admin.index_view,
                h=helpers,
                get_url=url_for,
            )
