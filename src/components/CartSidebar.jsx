import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/StoreContext";
import CheckoutModal from "./CheckoutModal";
import "./CartSidebar.css";

export default function CartSidebar() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
  } = useStore();

  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />

          {/* Sidebar Drawer */}
          <motion.aside
            className="cart-sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
          >
            <header className="cart-header">
              <h2>🛒 Your Vault</h2>
              <button className="close-btn" onClick={() => setCartOpen(false)}>
                ✖
              </button>
            </header>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        (item.image || "/merch/placeholder.png")
                      }
                      alt={item.name}
                      onError={(e) =>
                        (e.currentTarget.src =
                          process.env.PUBLIC_URL + "/merch/placeholder.png")
                      }
                    />
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p>${item.price.toFixed(2)}</p>

                      <div className="cart-qty">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <footer className="cart-footer">
                <div className="cart-summary">
                  <p>Total: ${cartTotal}</p>
                </div>

                <div className="cart-actions">
                  <button className="clear-btn" onClick={clearCart}>
                    Clear
                  </button>
                  <button
                    className="checkout-btn"
                    onClick={() => setShowCheckout(true)}
                  >
                    Checkout
                  </button>
                </div>
              </footer>
            )}
          </motion.aside>

          <CheckoutModal open={showCheckout} onClose={() => setShowCheckout(false)} />
        </>
      )}
    </AnimatePresence>
  );
}

