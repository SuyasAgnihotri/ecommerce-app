import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { createApiClient } from "../lib/api.js";

export default function Profile() {
  const { tokens, setTokens } = useAuth();
  const api = createApiClient(() => tokens?.access, setTokens);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    api.get("/profile/").then((res) => {
      setUser(res.data);
      setForm(res.data.profile || {});
    });
  }, []);

  const save = async () => {
    await api.put("/profile/", form);
    const res = await api.get("/profile/");
    setUser(res.data);
  };

  if (!user) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div style={{ padding: 16, maxWidth: 520 }}>
      <h2>Profile</h2>
      <div>Username: {user.username}</div>
      <div>Email: {user.email}</div>
      <h3>Address</h3>
      {[
        "address_line1",
        "address_line2",
        "city",
        "state",
        "postal_code",
        "country",
        "phone",
      ].map((k) => (
        <div key={k} style={{ marginBottom: 8 }}>
          <label style={{ display: "block" }}>{k}</label>
          <input
            value={form[k] || ""}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          />
        </div>
      ))}
      <button onClick={save}>Save</button>
    </div>
  );
}
