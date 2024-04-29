from flask import abort, current_app as app
from flask_marshmallow import Marshmallow
from google.cloud.firestore import DocumentSnapshot

ma = Marshmallow(app)


class FirebaseSchema(ma.Schema):
    """
    This class extends the Marshmallow Schema to add the
    required fields to the dictionary (for HATEOAS).
    """

    def dump(
        self,
        obj: list[DocumentSnapshot] | DocumentSnapshot,
        next: str = None,
        prev: str = None,
    ) -> list[dict] | dict:
        """
        Adds the id, next_id and prev_id to the document/documents.
        It checks if it is a single document or a list and handles it
        accordingly.

        Args:
            obj (list[DocumentSnapshot] | DocumentSnapshot): 
                The object or list of objects.
            next (str, optional):
                The next object ID, unused if parsing list of documents.
                Defaults to None.
            prev (str, optional): 
                The previous object ID, unused if parsing list of documents.
                Defaults to None.

        Returns:
            list[dict] | dict: Serialized document/documents.
        """
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
        # TODO: Add more fields.
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
            "self": ma.URLFor("api.car.get_car", values=dict(id="<id>")),
            "next": ma.URLFor("api.car.get_car", values=dict(id="<next_id>")),
            "prev": ma.URLFor("api.car.get_car", values=dict(id="<prev_id>")),
            "collection": ma.URLFor("api.car.get_cars"),
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
            "self": ma.URLFor("api.car.get_car", values=dict(id="<id>")),
        }
    )


car_schema = CarSchema()
cars_schema = CarsSchema(many=True)