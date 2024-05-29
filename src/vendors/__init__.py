import vendors.api.venues as venues
import vendors.api.transport as transport
import vendors.api.catering as catering
import vendors.api as api
from .views import bp
from flask_security import Security
from flask_admin import Admin, helpers
from flask import url_for
from safrs import SafrsApi
from .auth import auth


def create_app(app):
    app.register_blueprint(api.bp)
    app.register_blueprint(venues.bp)
    app.register_blueprint(catering.bp)
    app.register_blueprint(transport.bp)
    app.register_blueprint(bp)


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
            safrs.expose_object(
                model,
                method_decorators=[auth.login_required],
            )

        for model in transport.models:
            admin.add_view(api.AdminModelView(model, api.db.session))
            safrs.expose_object(
                model,
                "/transport",
                method_decorators=[auth.login_required],
            )

        for model in venues.models:
            admin.add_view(api.AdminModelView(model, api.db.session))
            safrs.expose_object(
                model,
                "/venues",
                method_decorators=[auth.login_required],
            )

        for model in catering.models:
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