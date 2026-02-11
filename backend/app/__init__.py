from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt, bcrypt
from .routes.auth import auth_bp
from .routes.posts import posts_bp
from time import sleep
from sqlalchemy.exc import OperationalError

def wait_for_db(app):
    with app.app_context():
        for i in range(10):  # tries 10 times
            try:
                db.create_all()
                print("Database connected!")
                break
            except OperationalError:
                print("Database unavailable, waiting 2s...")
                sleep(2)


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(posts_bp, url_prefix="/api/posts")

    wait_for_db(app)  # ← safe wait logic

    return app
