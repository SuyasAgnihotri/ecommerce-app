import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApiClient } from "../lib/api.js";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const api = createApiClient();

  const register = async (e) => {
    e.preventDefault();
    await api.post("/auth/register/", { username, email, password });
    navigate("/login");
  };

  return (
    <form onSubmit={register} style={{ padding: 16, maxWidth: 360 }}>
      <h2>Register</h2>
      <div>
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Create account</button>
    </form>
  );
}
