import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "../store/StoreContext";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useStore();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    alert("✅ Mock Payment Processed Successfully!");
    clearCart();
    navigate("/");
  };

  return (
    <div className="checkout-page">
      <motion.canvas
        className="checkout-canvas"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.div
        className="checkout-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="checkout-title">🧾 Secure Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your vault is empty.</p>
            <button onClick={() => navigate("/store")}>Return to Store</button>
          </div>
        ) : (
          <>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="checkout-item"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <img
                    src={process.env.PUBLIC_URL + (item.image || "/merch/placeholder.png")}
                    alt={item.name}
                  />
                  <div>
                    <h3>{item.name}</h3>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="checkout-summary">
              <h3>Total: ${total.toFixed(2)}</h3>
              <button onClick={handleCheckout}>Complete Purchase</button>
              <button onClick={() => navigate("/store")}>Back to Store</button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
