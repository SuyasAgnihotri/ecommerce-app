import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { createApiClient } from "../lib/api.js";
import { formatINR } from "../lib/format.js";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tokens, setTokens, isAuthenticated } = useAuth();
  const api = createApiClient(() => tokens?.access, setTokens);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}/`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <div style={{ padding: 16 }}>Loading...</div>;

  const addToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    await api.post("/cart/", { product_id: product.id, quantity });
    navigate("/cart");
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>{product.name}</h2>
      {product.image_url && (
        <img
          src={product.image_url}
          alt=""
          style={{ width: 320, height: 240, objectFit: "cover" }}
        />
      )}
      <p>{formatINR(product.price)}</p>
      <p>{product.description}</p>
      <div>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
