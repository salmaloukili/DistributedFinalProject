from flask_sqlalchemy import SQLAlchemy
from safrs import SAFRSBase

db = SQLAlchemy()



class user(SAFRSBase, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String)
