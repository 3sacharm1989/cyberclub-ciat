import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./SuccessPage.css";

export default function SuccessPage() {
  return (
    <div className="success-page">
      <motion.div
        className="success-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="glow-text">✅ Payment Confirmed</h1>
        <p>Your transaction was successful.</p>
        <Link to="/store" className="back-btn">
          Return to Store
        </Link>
      </motion.div>
    </div>
  );
}
