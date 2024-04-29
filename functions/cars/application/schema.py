from flask import abort, current_app as app
from flask_marshmallow import Marshmallow
from google.cloud.firestore import DocumentSnapshot

ma = Marshmallow(app)


class FirebaseSchema(ma.Schema):
    def dump(
        self,
        obj: list[DocumentSnapshot] | DocumentSnapshot,
        next: str = None,
        prev: str = None,
    ):
        if not obj:
            return []

        if isinstance(obj, list):
            _obj = []
            for it in obj:
                _it = it.to_dict()
                _it["id"] = it.id
                _obj.append(_it)
        else:
            if not obj.exists:
                return abort(404)

            _obj = obj.to_dict()
            _obj["id"] = obj.id

            _obj["next_id"] = next
            _obj["prev_id"] = prev

        return super().dump(_obj)


class CarSchema(FirebaseSchema):
    class Meta:
        fields = (
            "brand",
            "color",
            "dealer",
            "year_built",
            "_links",
        )

    # Smart hyperlinking
    _links = ma.Hyperlinks(
        {
            "self": ma.URLFor("car_api.car_detail", values=dict(id="<id>")),
            "next": ma.URLFor("car_api.car_detail", values=dict(id="<next_id>")),
            "prev": ma.URLFor("car_api.car_detail", values=dict(id="<prev_id>")),
            "collection": ma.URLFor("car_api.cars"),
        }
    )


class CarsSchema(FirebaseSchema):
    class Meta:
        fields = (
            "brand",
            "color",
            "dealer",
            "year_built",
            "_links",
        )

    # Smart hyperlinking
    _links = ma.Hyperlinks(
        {
            "self": ma.URLFor("car_api.car_detail", values=dict(id="<id>")),
        }
    )
