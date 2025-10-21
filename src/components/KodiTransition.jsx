import React, { useEffect } from "react";
import { motion } from "framer-motion";
import "./KodiTransition.css";

function KodiTransition({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5200); // a touch longer for fade-out timing
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="kodi-container">
      {/* Kodi enters */}
      <motion.div
        initial={{ x: "-100vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="kodi-text"
      >
        🐻 Kodi walks in...
      </motion.div>

      {/* Kodi sits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="kodi-text"
      >
        💺 Kodi sits in the chair
      </motion.div>

      {/* Kodi typing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="kodi-text"
      >
        ⌨️ Kodi starts typing on the computer...
      </motion.div>

      {/* Glow pulse before fade */}
      <motion.div
        className="screen-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ delay: 4.2, duration: 1 }}
      />

      {/* Fade to black transition */}
      <motion.div
        className="fade-out"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.8, duration: 0.8 }}
      />
    </div>
  );
}

export default KodiTransition;

