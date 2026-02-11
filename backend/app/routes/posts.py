from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import Post

posts_bp = Blueprint("posts", __name__)

@posts_bp.route("/", methods=["POST"])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.json

    post = Post(content=data["content"], user_id=user_id)
    db.session.add(post)
    db.session.commit()
    
    return jsonify({"message": "Post created"}), 201


@posts_bp.route("/", methods=["GET"])
def get_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()

    result = [
        {"id": p.id, "content": p.content, "user_id": p.user_id}
        for p in posts
    ]

    return jsonify(result)
