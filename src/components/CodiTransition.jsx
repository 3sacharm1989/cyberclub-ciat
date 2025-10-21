import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CodiTransition({ onFinish }) {
  useEffect(() => {
    // Automatically finish animation after 5 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          backgroundColor: "#000",
          color: "#00FF00",
          fontFamily: "monospace",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 2 }}
          style={{
            fontSize: "24px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Codi is moving to the computer...
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, duration: 2 }}
          style={{
            fontSize: "20px",
            border: "2px solid #00FF00",
            padding: "20px",
          }}
        >
          💻 Computer Activated
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
