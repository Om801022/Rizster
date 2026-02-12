const API = "http://localhost:5000";

let token = localStorage.getItem("token");

if (token) {
    showApp();
    loadPosts();
}

async function signup() {
    const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: signupUsername.value,
            email: signupEmail.value,
            password: signupPassword.value
        })
    });

    const data = await res.json();
    alert(data.message);
}

async function login() {
    const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: loginEmail.value,
            password: loginPassword.value
        })
    });

    const data = await res.json();

    if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        token = data.access_token;
        showApp();
        loadPosts();
    } else {
        alert("Login failed");
    }
}

async function createPost() {

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
        alert("Please login first");
        return;
    }

    const res = await fetch(`${API}/api/posts/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${storedToken}`
        },
        body: JSON.stringify({
            content: postContent.value
        })
    });

    if (!res.ok) {
        const err = await res.text();
        console.log(err);
        alert("Post failed");
        return;
    }

    postContent.value = "";
    loadPosts();
}


async function loadPosts() {
    const res = await fetch(`${API}/api/posts/`);
    const posts = await res.json();

    feed.innerHTML = "";

    posts.forEach(p => {
        const div = document.createElement("div");
        div.className = "card p-3 mb-3 shadow-sm";

        div.innerHTML = `
            <h6>@${p.username}</h6>
            <p>${p.content}</p>

            <div class="mb-2">
                <button class="btn btn-sm btn-outline-danger me-2"
                    onclick="toggleLike(${p.id})">
                    <i class="bi bi-heart-fill"></i> ${p.likes}
                </button>

                <button class="btn btn-sm btn-outline-secondary"
                    onclick="toggleComments(${p.id})">
                    <i class="bi bi-chat"></i> ${p.comments_count}
                </button>

            <div id="comments-${p.id}" class="mt-2" style="display:none;"></div>

            <div class="mt-3">
                <input type="text"
                    id="comment-input-${p.id}"
                    class="form-control mb-2"
                    placeholder="Write a comment...">

                <button class="btn btn-sm btn-primary"
                    onclick="submitComment(${p.id})">
                    Submit
                </button>
            </div>
        `;

        feed.appendChild(div);
    });
}



async function toggleLike(postId) {

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
        alert("Login required");
        return;
    }

    const res = await fetch(`${API}/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${storedToken}`
        }
    });

    if (!res.ok) {
        alert("Failed to like post");
        return;
    }

    loadPosts();
}


async function submitComment(postId) {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
        alert("Login required");
        return;
    }

    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value;

    if (!content.trim()) {
        alert("Comment cannot be empty");
        return;
    }

    const res = await fetch(`${API}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${storedToken}`
        },
        body: JSON.stringify({ content })
    });

    if (!res.ok) {
        alert("Failed to post comment");
        return;
    }

    loadPosts();
}

async function toggleComments(postId) {
    const container = document.getElementById(`comments-${postId}`);

    if (container.style.display === "none") {
        container.style.display = "block";
        loadComments(postId);
    } else {
        container.style.display = "none";
    }
}


async function loadComments(postId) {
    const res = await fetch(`${API}/api/posts/`);
    const posts = await res.json();

    const post = posts.find(p => p.id === postId);
    const container = document.getElementById(`comments-${postId}`);

    if (!post || !post.comments) {
        container.innerHTML = "<p>No comments</p>";
        return;
    }

    let commentsHTML = "";

    post.comments.forEach(c => {
        commentsHTML += `
            <div class="ms-3 mt-2">
                <strong>@${c.username}</strong>: ${c.content}
            </div>
        `;
    });

    container.innerHTML = commentsHTML;
}


function showApp() {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("post-section").style.display = "block";
}

function logout() {
    localStorage.removeItem("token");
    token = null;
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("post-section").style.display = "none";
}
