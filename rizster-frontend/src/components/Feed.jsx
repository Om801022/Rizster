import { useEffect, useState } from "react";
import API from "../api/api";



function Feed({ setIsLoggedIn }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [openComments, setOpenComments] = useState(null);
  const [commentText, setCommentText] = useState({});

  const fetchPosts = async () => {
    const res = await API.get("/posts/");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!content.trim()) return;

    await API.post("/posts/", { content });
    setContent("");
    fetchPosts();
  };

  const toggleSave = async (postId) => {
    await API.post(`/posts/${postId}/save`);
  };

  const toggleLike = async (postId) => {
    await API.post(`/posts/${postId}/like`);
    fetchPosts();
  };

  const addComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;

    await API.post(`/posts/${postId}/comment`, { content: commentText[postId] });
    setCommentText({ ...commentText, [postId]: "" });
    fetchPosts();
  };

  const sharePost = (post) => {
    const shareText = `${post.username}: ${post.content}`;
    if (navigator.share) {
      navigator.share({
        title: "Rizster Post",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Post copied to clipboard!");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div>
      <button className="btn btn-danger mb-3" onClick={logout}>
        Logout
      </button>

      <div className="card p-3 mb-3">
        <textarea
          className="form-control mb-2"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn btn-dark" onClick={createPost}>
          Post
        </button>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="card p-3 mb-3">
            <h6>@{post.username}</h6>
            <p>{post.content}</p>

            <div>
            <span
                style={{ cursor: "pointer" }}
                onClick={() => toggleLike(post.id)}
            >
                ❤️ {post.likes}
            </span>
            &nbsp;

            <span
                style={{ cursor: "pointer" }}
                onClick={() =>
                setOpenComments(openComments === post.id ? null : post.id)
                }
            >
                💬 {post.comments_count}
            </span>
            </div>

            <div className="mt-2">
            <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => toggleSave(post.id)}
            >
                🔖 Save
            </button>

            <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => sharePost(post)}
            >
                🔗 Share
            </button>
            </div>

            {openComments === post.id && (
            <div className="mt-2">
                {post.comments.map((comment) => (
                <div key={comment.id} className="ms-3">
                    <strong>@{comment.username}</strong>: {comment.content}
                </div>
                ))}
                <div className="ms-3 mt-2">
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    placeholder="Write a comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                  />
                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => addComment(post.id)}
                  >
                    Comment
                  </button>
                </div>
            </div>
            )}
        </div>
        ))}
    </div>
  );
}

export default Feed;
