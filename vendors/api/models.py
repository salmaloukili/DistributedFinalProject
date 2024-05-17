from flask_security import SQLAlchemyUserDatastore
import datetime
from flask_sqlalchemy import SQLAlchemy
from safrs import SAFRSBase
from flask_security.utils import hash_password
from flask_security import RoleMixin, UserMixin
from faker import Faker
import random

random.seed(1)
Faker.seed(1)

fake = Faker()
db = SQLAlchemy()


class TimeColumn(db.Column):
    def utcnow():
        return

    sample = utcnow()
    default = utcnow


def FunctionDefault(col, **kwargs):
    _sample = None
    try:
        _sample = kwargs["default"]()
    except (KeyError, TypeError):
        print("FunctionDefault: Default is not a function or not found.")

    cls = type(f"Column_{col}_{_sample}", (db.Column,), dict(sample=_sample))
    return cls(col, **kwargs)


class BaseModel(SAFRSBase, db.Model):
    __abstract__ = True
    created_at = FunctionDefault(
        db.DateTime,
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
    )
    modified_at = FunctionDefault(
        db.DateTime,
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc),
    )


roles_employees = db.Table(
    "roles_employees",
    db.Column("employees_id", db.Integer(), db.ForeignKey("employees.id")),
    db.Column("roles_id", db.Integer(), db.ForeignKey("roles.id")),
)


class Role(SAFRSBase, db.Model, RoleMixin):
    __tablename__ = "roles"
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    def __str__(self):
        return self.name


class Employee(BaseModel, UserMixin):
    __tablename__ = "employees"
    id = db.Column(db.Integer, primary_key=True)
    first_name = FunctionDefault(db.String(50), default=fake.first_name)
    last_name = FunctionDefault(db.String(50), default=fake.last_name)

    email = FunctionDefault(db.String(120), default=fake.email)
    password = db.Column(db.String(255))

    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    fs_uniquifier = db.Column(db.String(64), unique=True, nullable=False)
    roles = db.relationship(
        "Role", secondary=roles_employees, backref=db.backref("users", lazy="dynamic")
    )


def populate_database():

    db.drop_all()
    db.create_all()
    user_role = Role(name="user")
    super_user_role = Role(name="superuser")
    db.session.add(user_role)
    db.session.add(super_user_role)
    db.session.commit()

    datastore.create_user(
        first_name="Admin",
        email="admin@example.com",
        password=hash_password("admin"),
        roles=[user_role, super_user_role],
    )
    return "Success"


datastore = SQLAlchemyUserDatastore(db, Employee, Role)
models = [Role, Employee]
