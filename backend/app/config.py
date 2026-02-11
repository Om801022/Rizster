import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret")

    DB_USER = os.getenv("POSTGRES_USER", "user")
    DB_PASS = os.getenv("POSTGRES_PASSWORD", "password")
    DB_NAME = os.getenv("POSTGRES_DB", "rizster")
    DB_HOST = os.getenv("POSTGRES_HOST", "localhost")

    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:5432/{DB_NAME}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
