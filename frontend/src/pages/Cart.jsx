import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { createApiClient } from "../lib/api.js";

export default function Cart() {
  const navigate = useNavigate();
  const { tokens, isAuthenticated, setTokens } = useAuth();
  const api = createApiClient(() => tokens?.access, setTokens);
  const [items, setItems] = useState([]);

  const load = async () => {
    const res = await api.get("/cart/");
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const total = items.reduce(
    (sum, i) => sum + i.quantity * Number(i.product.price),
    0
  );

  const remove = async (id) => {
    await api.delete(`/cart/${id}/`);
    load();
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Cart</h2>
      {!isAuthenticated && (
        <p>
          Please <Link to="/login">login</Link> to checkout.
        </p>
      )}
      {items.map((i) => (
        <div
          key={i.id}
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            borderBottom: "1px solid #eee",
            padding: 8,
          }}
        >
          <div style={{ flex: 1 }}>{i.product.name}</div>
          <div>x{i.quantity}</div>
          <div>${Number(i.product.price).toFixed(2)}</div>
          <button onClick={() => remove(i.id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
      <button
        onClick={() => navigate("/checkout")}
        disabled={!isAuthenticated || items.length === 0}
      >
        Checkout
      </button>
    </div>
  );
}
