import { useState } from "react";
import API from "../api/api";

function Auth({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      setIsLoggedIn(true);
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h4>Login</h4>
      <input
        className="form-control mb-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="form-control mb-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-primary" onClick={login}>
        Login
      </button>
    </div>
  );
}

export default Auth;
