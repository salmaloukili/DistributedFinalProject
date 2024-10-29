# Firebase Event packages 


This project implements a distributed event broker system where users can purchase event packages, including transportation and catering, using a serverless architecture on Google Cloud. The system uses Firestore for data storage, Firebase Authentication for user management, and Cloud Functions for scalable API endpoints.

## Features
- **Event Packages**: Users can view, reserve, and purchase event packages.
- **Access Control**: Firebase Authentication manages user roles, with admin privileges for viewing transactions and user details.
- **Data Consistency**: Firestore caches vendor data, updated on schedule to ensure eventual consistency.
- **Fault Tolerance**: Stateless Cloud Functions and caching prevent system failures during high demand.

## Architecture
- **Frontend**: Built with React, deployed on Firebase Hosting for global CDN support.
- **Backend**: Cloud Functions with Firestore and Cloud Storage, using Dockerized vendor services on Azure for scalability.
- **Database Model**: Firestore uses a flexible, nested document structure suited for NoSQL, supporting vendor data and user purchases.


## Setup
To set up the project for the first time run the following:
```
chmod +x ./setup.sh
./setup.sh
```

## Activate the virtual environment
Activate the virtual environment by running the following command:
```
source ./venv/bin/activate
```

## Running
The setup script automatically builds the sites so you only have to run:
```
npm run dev
```
This deploys the website locally and initiates a firestore database, which will store data locally for faster access. The local website can be accessed through the following URL: http://localhost:3030/


