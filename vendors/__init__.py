import vendors.api.venues as venues
import vendors.api.transport as transport
import vendors.api.catering as catering
import vendors.api as api
from .views import bp
from flask_security import Security
from flask_admin import Admin, helpers
from flask import url_for
from safrs import SafrsApi


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

        security = Security(app, api.datastore)
        safrs = SafrsApi(app, host="127.0.0.1", prefix="/api")

        swagger = safrs.get_swagger_doc()
        swagger["securityDefinitions"] = {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "Enter the token with the `Bearer: ` prefix, e.g. 'Bearer abcde12345'.",
            }
        }

        safrs._custom_swagger = swagger

        for model in api.models:
            admin.add_view(api.AdminModelView(model, api.db.session))
            safrs.expose_object(
                model,
                method_decorators=[api.auth.verify_token],
            )

        for model in transport.models:
            admin.add_view(api.AdminModelView(model, api.db.session))
            safrs.expose_object(
                model,
                "/transport",
                method_decorators=[api.auth.verify_token],
            )

        for model in venues.models:
            admin.add_view(api.AdminModelView(model, api.db.session))
            safrs.expose_object(
                model,
                "/venues",
                method_decorators=[api.auth.verify_token],
            )

        for model in catering.models:
            admin.add_view(api.AdminModelView(model, api.db.session))
            safrs.expose_object(
                model,
                "/catering",
                method_decorators=[api.auth.verify_token],
            )

        @security.context_processor
        def security_context_processor():
            return dict(
                admin_base_template=admin.base_template,
                admin_view=admin.index_view,
                h=helpers,
                get_url=url_for,
            )
