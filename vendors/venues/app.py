from flask import Flask
from .api import create_app, setup_database

app = Flask(__name__)
create_app(app)
app.config.from_pyfile('config.py')
setup_database(app)
