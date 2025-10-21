import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useStore } from "../store/StoreContext";
import "./CheckoutModal.css";

export default function CheckoutModal({ open, onClose }) {
  const { cart, cartTotal, clearCart } = useStore();
  const [payment, setPayment] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // ---------------- Stripe Checkout ----------------
  const handleStripeCheckout = async () => {
    try {
      setProcessing(true);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });
      const data = await res.json();
      if (data.url) {
        window.location = data.url;
      } else {
        throw new Error("Stripe session not created");
      }
    } catch (err) {
      console.error(err);
      alert("Stripe checkout failed. Check console for details.");
      setProcessing(false);
    }
  };

  // ---------------- PayPal Success ----------------
  const handlePayPalSuccess = (details) => {
    console.log("PayPal payment success:", details);
    setSuccess(true);
    clearCart();
    setTimeout(onClose, 2500);
  };

  // ---------------- Checkout Handler ----------------
  const handleCheckout = () => {
    if (!payment) return alert("Please select a payment method.");
    if (payment === "Credit Card" || payment === "Apple Pay") {
      handleStripeCheckout();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="checkout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="checkout-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {!success ? (
              <>
                <h2>💳 Secure Checkout</h2>
                <p>
                  Total: <strong>${cartTotal}</strong>
                </p>

                <div className="payment-options">
                  {["Credit Card", "PayPal", "Apple Pay"].map((option) => (
                    <label
                      key={option}
                      className={`payment-option ${
                        payment === option ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option}
                        checked={payment === option}
                        onChange={(e) => setPayment(e.target.value)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                {(payment === "Credit Card" || payment === "Apple Pay") && (
                  <div className="checkout-actions">
                    <button className="cancel-btn" onClick={onClose}>
                      Cancel
                    </button>
                    <button
                      className="confirm-btn"
                      onClick={handleCheckout}
                      disabled={processing}
                    >
                      {processing ? "Processing..." : "Proceed to Pay"}
                    </button>
                  </div>
                )}

                {payment === "PayPal" && (
                  <div className="paypal-section">
                    <PayPalScriptProvider
                      options={{
                        "client-id": "ARl9Kcpl4_QUM7v-ByrtiazNlk3aGy8QP4zUOLFl4pdTGSMy28PuN7-KFuXqNtKeblzQMcf48t_3KFhw", // Replace
                        currency: "USD",
                      }}
                    >
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                          color: "blue",
                          shape: "pill",
                          label: "paypal",
                        }}
                        createOrder={(data, actions) =>
                          actions.order.create({
                            purchase_units: [
                              { amount: { value: cartTotal } },
                            ],
                          })
                        }
                        onApprove={async (data, actions) => {
                          const details = await actions.order.capture();
                          handlePayPalSuccess(details);
                        }}
                        onError={(err) => {
                          console.error(err);
                          alert("PayPal payment failed.");
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                className="checkout-success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <h3>✅ Payment Successful!</h3>
                <p>Thank you for securing your CIAT merch.</p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
