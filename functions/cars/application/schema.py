from flask import current_app
from flask_marshmallow import Marshmallow

app = current_app()
ma = Marshmallow(app)

class UserSchema(ma.Schema):
    class Meta:
        fields = ("email", "date_created", "_links")

    # Smart hyperlinking
    _links = ma.Hyperlinks(
        {
            "self": ma.URLFor("user_detail", values=dict(id="<id>")),
            "collection": ma.URLFor("users"),
        }
    )
