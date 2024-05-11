from flask_security import Security
from flask_admin import Admin, helpers
from flask import url_for
from safrs import SafrsApi
from .views import bp


def create_app(app):
    app.register_blueprint(bp)


def setup_database(app):
    from .models import db, models, datastore, auth
    from .admin import MyModelView

    with app.app_context():
        db.init_app(app)
        db.create_all()
        admin = Admin(
            app,
            "Example: Auth",
            base_template="my_master.html",
            template_mode="bootstrap4",
        )

        security = Security(app, datastore)
        api = SafrsApi(app, host="127.0.0.1", prefix="/api")

        swagger = api.get_swagger_doc()
        swagger["securityDefinitions"] = {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "Enter the token with the `Bearer: ` prefix, e.g. 'Bearer abcde12345'.",
            }
        }

        api._custom_swagger = swagger

        for model in models:
            admin.add_view(MyModelView(model, db.session))
            api.expose_object(
                model,
                method_decorators=[auth.verify_token],
            )

        @security.context_processor
        def security_context_processor():
            return dict(
                admin_base_template=admin.base_template,
                admin_view=admin.index_view,
                h=helpers,
                get_url=url_for,
            )
