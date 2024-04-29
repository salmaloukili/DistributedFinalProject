# Firebase Car-Rental
## Setup
Before running the script you should have access to the project in Firebase, ask Nico to give you access.
To set up the project for the first time run the following:
```
chmod +x ./setup.sh
./setup.sh
```

## Running
The setup script automatically builds the sites so you only have to run:
```
firebase emulators:start --import=./saved_data
```
This will deploy everything locally, if you are working on the sites and want to have live reload you can either run them using dev or build. Dev will run them separate from firebase so the API might not work but the page will reload by itself. Good to develop the site's appearance. 

```
npm run dev
```

Otherwise simply run build with watch enabled. This means every change the site will rebuild. This is much slower but ensures firebase emulator is the one hosting the site. Use this when testing API things.

```
npm run build:watch
```

The setup script creates virtual environments per Cloud Function. You can select one of them in VS Code to use as the default interpreter for Python. I don't recommend using IntelliJ. There is a VS Code profile for Python and it is very good.

