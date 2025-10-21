import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./AlumniLogin.css";

const ciphers = [
  { hint: "ROT13: PNVG", code: "CIAT" },
  { hint: "Caesar Shift +5: HTRJX", code: "CODES" },
  { hint: "Binary: 01000011 01011001 01000010 01000101 01010010", code: "CYBER" },
  { hint: "Morse: -.-. .. .- -", code: "CIAT" },
  { hint: "Hex: 434f444552", code: "CODER" },
];

const AlumniLogin = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [stage, setStage] = useState("vault");
  const [cipher, setCipher] = useState(ciphers[Math.floor(Math.random() * ciphers.length)]);
  const [badgeCode, setBadgeCode] = useState("");
  const [error, setError] = useState("");

  // Binary rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ffff";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  // Stage transitions
  useEffect(() => {
    const doorTimer = setTimeout(() => setStage("hologram"), 2500);
    const decryptTimer = setTimeout(() => setStage("decrypting"), 5500);
    const loginTimer = setTimeout(() => setStage("login"), 8000);
    return () => {
      clearTimeout(doorTimer);
      clearTimeout(decryptTimer);
      clearTimeout(loginTimer);
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (badgeCode.toUpperCase().trim() === cipher.code) {
      navigate("/alumni");
    } else {
      setError("Access Denied: Incorrect Cipher Code");
      setTimeout(() => setError(""), 2500);
    }
  };

  return (
    <div className="alumni-login-container">
      <canvas ref={canvasRef} className="binary-bg" />

      {/* Vault Opening */}
      {stage === "vault" && (
        <div className="vault-container">
          <motion.div
            className="vault-door-left"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
          <motion.div
            className="vault-door-right"
            initial={{ x: 0 }}
            animate={{ x: "50%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
          <motion.img
            src="/AlumniCrest.png"
            alt="Vault Crest"
            className="vault-crest"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
        </div>
      )}

      {/* Hologram Reveal */}
      {stage === "hologram" && (
        <>
          <motion.div
            className="holo-scan"
            initial={{ y: "-100%" }}
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.img
            src="/AlumniCrest.png"
            alt="Hologram Crest"
            className="alumni-crest-holo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
          />
        </>
      )}

      {/* NEW: Decrypting Access Key */}
      {stage === "decrypting" && (
        <motion.div
          className="decrypting-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="decrypting-text"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🔐 Decrypting Access Key...
          </motion.div>

          <div className="decrypting-progress">
            <motion.div
              className="progress-bar"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}

      {/* Cipher Login Interface */}
      {stage === "login" && (
        <motion.div
          className="alumni-login-box"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src="/AlumniCrest.png"
            alt="Crest"
            className="alumni-crest"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <h1>CIAT Alumni Vault Access</h1>
          <p>Decode the cipher below to unlock access to the Alumni Network.</p>

          <div className="cipher-hint">
            <strong>Cipher Challenge:</strong>
            <p>{cipher.hint}</p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter Decoded Code..."
              value={badgeCode}
              onChange={(e) => setBadgeCode(e.target.value)}
              className={error ? "error" : ""}
            />
            <button type="submit">Decrypt & Access</button>
          </form>

          {error && (
            <motion.p className="error-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {error}
            </motion.p>
          )}

          <button className="back-btn" onClick={() => navigate("/")}>
            ⬅ Return to Dashboard
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default AlumniLogin;






