# Firebase Event packages
## Setup
To set up the project for the first time run the following:
```
chmod +x ./setup.sh
./setup.sh
```
The setup script creates virtual environments per Cloud Function. You can select one of them in VS Code to use as the default interpreter for Python. I don't recommend using IntelliJ. There is a VS Code profile for Python and it is very good.

#Activate the virtual environment

## Running
The setup script automatically builds the sites so you only have to run:
```
npm run dev
```
This deploys the website locally and initiates a firestore database, which will store data locally for faster access.


## API
The API is hosted in a Cloud Function (can be emulated as well). It is only meant for the b2b site and not the rental-site. The rental site can access Firestore directly 
since it is under "our" control. The Cloud Function makes it very easy to deploy and to replicate infinitely. It uses Flask instead of the default http_handler from 
Firebase. It is sort of a monolith but HATEOAS forces that slightly.

## Faker
A small faker function is loaded onto some URL to generate new data on the fly. Can be very useful for testing. You can save a snapshot of the emulator as well.

## Other Cloud Functions
I left another functions called util, this should be used for Firebase event driven functions. Lets say whenever someone rents a car, I want to make a new cleaning order.
Or whenever a new user is added do x or y, it should go there.

## Vendors
To run the vendors, make sure you have the venv sourced with flask. Run `flask --debug run` in the folder with app.py.
