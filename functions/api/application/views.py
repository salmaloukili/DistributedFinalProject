from flask import Blueprint, url_for, current_app as app

api_bp = Blueprint("api", __name__)


@api_bp.get("/")
def site_map()-> dict[str, str | list]:
    """
    Returns a dict containing all the endpoints as well as their 
    information such as path, method, and arguments.

    Returns:
        dict[str, str | list]: _description_
    """
    links = {}
    for rule in app.url_map.iter_rules():
        if rule.endpoint == "static":
            continue

        try:
            url = url_for(rule.endpoint, **(rule.defaults or {}))
        except Exception:
            url = url_for(rule.endpoint, **(rule.defaults or {"id": ""}))

        links[rule.endpoint] = {
            "path": url,
            "methods": list(rule.methods),
            "arguments": list(rule.arguments or ""),
        }
    return links
