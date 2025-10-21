import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [showContent, setShowContent] = useState(false);

  // 🟢 Binary Rain Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "01";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ffff";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    setTimeout(() => setShowContent(true), 1500);

    return () => clearInterval(interval);
  }, []);

  // 🟦 Vault-style Transition Animation
  const handleNavigation = (path) => {
    const vaultDoor = document.createElement("div");
    vaultDoor.className = "vault-transition";
    document.body.appendChild(vaultDoor);

    setTimeout(() => {
      navigate(path);
      document.body.removeChild(vaultDoor);
    }, 1200);
  };

  return (
    <div className="dashboard-container">
      {/* Binary Background */}
      <canvas ref={canvasRef} className="binary-bg" />

      {/* Silhouette Logo Background */}
      <div className="dashboard-logo">
        <img src="/cybersecurityclublogo.webp" alt="CIAT Cybersecurity Logo" />
      </div>

      {/* Header */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="glow-title">
          <span className="blue-glow">CIAT</span>{" "}
          <span className="gold-glow">Cybersecurity Command Center</span>
        </h1>
      </motion.div>

      {/* Main Navigation Cards */}
      {showContent && (
        <motion.div
          className="dashboard-cards"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          {[
            { name: "Announcements", path: "/announcements" },
            { name: "Events", path: "/events" },
            { name: "Activities", path: "/activities" },
            { name: "Accreditations", path: "/accreditations" },
            { name: "Store", path: "/store" },
            { name: "🎓 Alumni Vault", path: "/alumni-login" }, // ✅ Corrected route
          ].map((card, idx) => (
            <motion.div
              key={idx}
              className="dashboard-card"
              whileHover={{
                scale: 1.07,
                boxShadow: "0 0 25px #00ffff",
                backgroundColor: "rgba(0,255,255,0.05)",
              }}
              onClick={() => handleNavigation(card.path)}
            >
              <h2>{card.name}</h2>
              <p>
                Access{" "}
                {card.name === "🎓 Alumni Vault"
                  ? "the Alumni Network"
                  : `the ${card.name} section`}
                .
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;

