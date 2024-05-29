from flask_httpauth import HTTPTokenAuth

auth = HTTPTokenAuth()


@auth.verify_token
def verify_token(token):
    return token == "token"
