import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { createApiClient } from "../lib/api.js";
import { formatINR } from "../lib/format.js";

export default function Products() {
  const { tokens } = useAuth();
  const api = createApiClient(() => tokens?.access);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products/").then((res) => setProducts(res.data));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Products</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: 12 }}>
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.name}
                style={{ width: "100%", height: 140, objectFit: "cover" }}
              />
            )}
            <h3>{p.name}</h3>
            <p>{formatINR(p.price)}</p>
            <Link to={`/product/${p.id}`}>View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
