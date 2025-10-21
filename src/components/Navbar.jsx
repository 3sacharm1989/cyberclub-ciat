import React from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/StoreContext";
import "./Navbar.css";

export default function Navbar() {
  const { cartCount, setCartOpen } = useStore();

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="nav-left">
        <a href="/" className="nav-logo">
          <span className="nav-glow">CIAT Cyber Vault</span>
        </a>
      </div>

      <div className="nav-right">
        <a href="/store" className="nav-link">
          Store
        </a>
        <a href="/about" className="nav-link">
          About
        </a>
        <a href="/contact" className="nav-link">
          Contact
        </a>

        <div
          className="nav-cart"
          onClick={() => setCartOpen(true)}
          title="Open Cart"
        >
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </div>
    </motion.nav>
  );
}
