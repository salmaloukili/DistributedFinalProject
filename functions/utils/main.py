from firebase_functions import https_fn
from faker import Faker
from firebase_admin import credentials, firestore, initialize_app
import random

# Initialize Firebase
initialize_app()
db = firestore.client()
batch = db.batch()

car_ref = db.collection("cars")
user_ref = db.collection("users")
company_ref = db.collection("companies")


# Faker
fake = Faker(["fr_FR", "it_IT", "de_DE", "nl_BE"])
Faker.seed(0)

random.seed(0)


def create_car(car_dealer: str) -> dict[str, int | str]:
    return {
        "dealer": car_dealer,
        "brand": fake.company(),
        "year_built": fake.year(),
        "kilometers": random.randint(5000, 200000),
        "price": round(random.uniform(100, 1000), 2),
        "color": fake.color_name(),
        "range": random.randint(100, 500),
        "plate": fake.license_plate(),
    }


def create_rental(user: str) -> dict[str, int | str]:
    return {
        "done": random.randint(0, 1) == 1,
        "location": fake.address(),
        "start_datetime": fake.date_time_this_year(),
        "end_datetime": fake.date_time_this_year(),
        "renter": user,
    }


def create_fake_user() -> dict[str, int | str]:
    return {
        "name": fake.name(),
        "address": fake.address(),
        "contact": fake.phone_number(),
        "email": fake.email(),
        "date_of_birth": fake.date_of_birth(minimum_age=18, maximum_age=90).isoformat(),
        "license_number": fake.license_plate(),
    }


def create_fake_dealership() -> dict[str, int | str]:
    return {
        "name": fake.company(),
        "location": fake.address(),
        "owner": fake.name(),
        "established_year": fake.year(),
        "contact": fake.phone_number(),
        "email": fake.company_email(),
        "number_of_cars": random.randint(50, 200),
        "kind": "dealership",
    }


def create_fake_transport_company() -> dict[str, int | str]:
    return {
        "name": fake.company(),
        "location": fake.address(),
        "owner": fake.name(),
        "established_year": fake.year(),
        "contact": fake.phone_number(),
        "email": fake.company_email(),
        "number_of_trucks": random.randint(5, 50),
        "capacity_per_truck": random.randint(1, 10),
        "kind": "transport",
    }


def create_fake_cleaning_company() -> dict[str, int | str | list]:
    return {
        "name": fake.company(),
        "location": fake.address(),
        "owner": fake.name(),
        "established_year": fake.year(),
        "contact": fake.phone_number(),
        "email": fake.company_email(),
        "number_of_employees": random.randint(5, 50),
        "services_offered": ["interior", "exterior", "engine", "wax", "polish"],
        "kind": "cleaning",
    }


@https_fn.on_request(region="europe-west1")
def faker_run(req: https_fn.Request) -> https_fn.Response:
    # batch.set()
    for i in range(10, random.randint(15, 20)):
        if i % 2:
            batch.set(
                company_ref.document(),
                create_fake_cleaning_company().update(create_fake_transport_company()),
            )
        else:
            batch.set(
                company_ref.document(),
                create_fake_cleaning_company(),
            )

        batch.set(
            company_ref.document(),
            create_fake_transport_company(),
        )

    users = []
    for i in range(0, 1000):
        user = user_ref.document()
        users.append(user.id)
        batch.set(user, create_fake_user())

    for _ in range(0, 10):
        dealership = company_ref.document()
        batch.set(dealership, create_fake_dealership())
        for _ in range(0, random.randint(0, 40)):
            car = car_ref.document()
            batch.set(car, create_car(dealership.id))
            for _ in range(0, random.randint(0, 10)):
                batch.set(
                    car_ref.document(car.id).collection("rental").document(),
                    create_rental(users[random.randint(0, 999)]),
                )

    return [str(x) for x in batch.commit()]
