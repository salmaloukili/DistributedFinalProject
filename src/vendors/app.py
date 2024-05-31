from flask import Flask
from . import create_app, setup_database

app = Flask(__name__)
app.config.from_pyfile("config.py")

create_app(app)
setup_database(app)
