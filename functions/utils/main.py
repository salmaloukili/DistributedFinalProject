from firebase_functions import https_fn
from firebase_admin import initialize_app

# Initialize Firebase
initialize_app()


@https_fn.on_request(region="europe-west1")
def utils_run(req: https_fn.Request) -> https_fn.Response:
    return "Test"
