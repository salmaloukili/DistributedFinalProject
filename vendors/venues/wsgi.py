from .application import create_app, setup_database

app = create_app()
setup_database(app)
