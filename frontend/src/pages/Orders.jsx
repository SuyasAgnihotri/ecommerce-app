import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { createApiClient } from "../lib/api.js";

export default function Orders() {
  const { tokens, setTokens } = useAuth();
  const api = createApiClient(() => tokens?.access, setTokens);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/").then((res) => setOrders(res.data));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Orders</h2>
      {orders.map((o) => (
        <div
          key={o.id}
          style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}
        >
          <div>
            Status: {o.status} | Total: ${Number(o.total_amount).toFixed(2)}
          </div>
          <ul>
            {o.items.map((it) => (
              <li key={it.id}>
                {it.quantity} x {it.product.name} @ $
                {Number(it.unit_price).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
