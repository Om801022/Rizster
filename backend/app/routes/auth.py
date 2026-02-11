from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from ..extensions import db, bcrypt
from ..models import User
from sqlalchemy.exc import IntegrityError

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json

    hashed_pw = bcrypt.generate_password_hash(
        data["password"]
    ).decode("utf-8")

    user = User(
        username=data["username"],
        email=data["email"],
        password=hashed_pw
    )

    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User created"}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "User already exists"}), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({"access_token": token})
