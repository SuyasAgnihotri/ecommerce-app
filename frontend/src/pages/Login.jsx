import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { createApiClient } from "../lib/api.js";

export default function Login() {
  const { setTokens } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const api = createApiClient();

  const login = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/token/", { username, password });
    setTokens(res.data);
    navigate("/");
  };

  return (
    <form onSubmit={login} style={{ padding: 16, maxWidth: 360 }}>
      <h2>Login</h2>
      <div>
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
