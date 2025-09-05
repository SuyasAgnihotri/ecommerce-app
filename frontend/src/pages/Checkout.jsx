import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { createApiClient } from "../lib/api.js";

export default function Checkout() {
  const navigate = useNavigate();
  const { tokens } = useAuth();
  const api = createApiClient(() => tokens?.access);

  const placeOrder = async () => {
    const res = await api.post("/orders/checkout/");
    navigate(`/orders`);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Checkout</h2>
      <p>
        Review your cart in the previous page. When ready, place your order.
      </p>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}
