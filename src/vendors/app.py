import os
from flask import Flask
import logging
from . import create_app, setup_database

app = Flask(__name__)
app.config.from_pyfile("config.py")

create_app(app)
setup_database(app)

logger = logging.getLogger("azure")

for key, value in os.environ.items():
    if key.startswith("VENDOR_"):
        logger.info(f"{key}={value}\n")
