from flask import request
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from sqlalchemy.exc import IntegrityError
from ..models import Post
from ..models import Like
from ..models import Comment
from ..models import SavedPost


posts_bp = Blueprint("posts", __name__)

@posts_bp.route("/", methods=["POST"])
@jwt_required()
def create_post():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data or "content" not in data or not data["content"].strip():
        return {"message": "Content required"}, 400

    post = Post(content=data["content"], user_id=user_id)
    db.session.add(post)
    db.session.commit()

    return {"message": "Post created"}, 201


@posts_bp.route("/<int:post_id>/like", methods=["POST"])
@jwt_required()
def toggle_like(post_id):
    user_id = int(get_jwt_identity())

    existing_like = Like.query.filter_by(
        user_id=user_id,
        post_id=post_id
    ).first()

    if existing_like:
        db.session.delete(existing_like)
        db.session.commit()
        return {"message": "Unliked"}, 200
    else:
        like = Like(user_id=user_id, post_id=post_id)
        db.session.add(like)
        db.session.commit()
        return {"message": "Liked"}, 201


@posts_bp.route("/<int:post_id>/comment", methods=["POST"])
@jwt_required()
def add_comment(post_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data or "content" not in data or not data["content"].strip():
        return {"message": "Comment required"}, 400

    comment = Comment(
        content=data["content"],
        user_id=user_id,
        post_id=post_id
    )

    db.session.add(comment)
    db.session.commit()

    return {"message": "Comment added"}, 201


@posts_bp.route("/", methods=["GET"])
def get_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()

    result = [
        {
            "id": p.id,
            "content": p.content,
            "username": p.author.username,
            "likes": len(p.likes),
            "comments_count": len(p.comments),
            "comments": [
                {
                    "id": c.id,
                    "content": c.content,
                    "username": c.author.username
                }
                for c in p.comments
            ]
        }
        for p in posts
    ]

    return jsonify(result)

@posts_bp.route("/<int:post_id>/save", methods=["POST"])
@jwt_required()
def toggle_save(post_id):
    user_id = int(get_jwt_identity())

    existing = SavedPost.query.filter_by(
        user_id=user_id,
        post_id=post_id
    ).first()

    if existing:
        db.session.delete(existing)
        db.session.commit()
        return {"message": "Unsaved"}, 200
    else:
        save = SavedPost(user_id=user_id, post_id=post_id)
        db.session.add(save)
        db.session.commit()
        return {"message": "Saved"}, 201

