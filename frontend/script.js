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
    await fetch(`${API}/api/posts/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            content: postContent.value
        })
    });

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
        div.innerHTML = `<p>${p.content}</p>`;
        feed.appendChild(div);
    });
}

function showApp() {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("post-section").style.display = "block";
}
