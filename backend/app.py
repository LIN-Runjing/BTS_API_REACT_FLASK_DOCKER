from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, bcrypt, jwt
from models import *
from routes import register_routes
from utils.init_roles import init_roles

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    app.config['SECRET_KEY'] = 'FdVw9jEX2t0uM8iQzvOEZLRhHTvHjQAvlC02xI9eWhaW7GZr0z7h6AqM9LJ5nYvR'
    app.config['JWT_SECRET_KEY'] = 'mXgW1r2EpQw9Df8oJh3cR7vA0bKpN4yGzZx6uVfT5dLs8qHcBnYkP3wE2tJrM0aC'

    # Init extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Register blueprints
    register_routes(app)

    # Register startup logic
    @app.before_request
    def create_tables():
        db.create_all()
        init_roles()
        
    @app.route("/")
    def home():
        return "Backend OK"

    @app.route("/api/health")
    def health():
        return jsonify(status="ok")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, use_reloader=True, host="0.0.0.0", port=5000)
