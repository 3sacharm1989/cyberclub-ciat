import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactTyped as Typed } from "react-typed";
import "./HackerScreen.css";

const phrases = [
  "Firewall", "Encryption", "Zero Trust", "Access Granted",
  "Threat Detected", "VPN Secure", "Malware", "Phishing", "Cyber Sentinel",
];

const textToBinary = (text) =>
  text.split("").map((char) =>
    char.charCodeAt(0).toString(2).padStart(8, "0")
  ).join(" ");

const HackerScreen = ({ onAccessGranted }) => {
  const [mode, setMode] = useState("choose");
  const [binaryPhrase, setBinaryPhrase] = useState("");
  const [decodedPhrase, setDecodedPhrase] = useState("");
  const [userInput, setUserInput] = useState("");
  const [access, setAccess] = useState(null);
  const [showBinary, setShowBinary] = useState(false);
  const [booting, setBooting] = useState(false);
  const [bootLines, setBootLines] = useState([]);
  const [visibleLines, setVisibleLines] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);
  const canvasRef = useRef(null);

  /* Fade in effect when mounted */
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeIn(true), 300);
    return () => clearTimeout(fadeTimer);
  }, []);

  /* Matrix background */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const chars = "01";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00FF00";
      ctx.font = fontSize + "px monospace";
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
          drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);

  /* Cipher phrase */
  useEffect(() => {
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    setDecodedPhrase(phrase);
    setBinaryPhrase(textToBinary(phrase));
  }, []);

  useEffect(() => {
    let flicker;
    if (mode === "member") {
      flicker = setInterval(() => setShowBinary((p) => !p), 1300);
    }
    return () => clearInterval(flicker, 10);
  }, [mode]);

  const handleAccess = (granted) => {
    setAccess(granted ? "granted" : "denied");
    if (granted) {
      setTimeout(() => {
        setBooting(true);
        startBootSequence();
      }, 1500);
      setTimeout(() => onAccessGranted(), 8500);
    } else {
      setTimeout(() => setAccess(null), 2000);
    }
  };

  const getTimestamp = () => {
    const now = new Date();
    return now.toISOString().split("T")[1].split(".")[0];
  };

  const startBootSequence = () => {
    const logs = [
      "Initializing Secure Kernel",
      "Loading Cyber Defense Modules",
      "Deploying IDS/IPS Layers",
      "Verifying Member Authentication",
      "Scanning for Threat Signatures",
      "Establishing Encrypted Channels",
      "Launching Dashboard Interface",
    ];
    const lines = logs.map((line) => `[${getTimestamp()}] [OK] ${line}...`);
    setBootLines(lines);
    let i = 0;
    const interval = setInterval(() => {
      setVisibleLines((prev) => [...prev, lines[i]]);
      i++;
      if (i >= lines.length) clearInterval(interval);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "member") {
      handleAccess(userInput.trim().toLowerCase() === decodedPhrase.toLowerCase());
    } else if (mode === "admin") {
      handleAccess(userInput === "ciatadmin");
    }
  };

  return (
    <div className={`hacker-screen ${fadeIn ? "fade-in" : ""}`}>
      <canvas ref={canvasRef} className="matrix-canvas" />

      {/* Boot Sequence */}
      {booting ? (
        <div className="boot-sequence">
          {visibleLines.map((line, i) => (
            <p key={i} style={{ color: "#00FF00" }}>{line}</p>
          ))}
        </div>
      ) : (
        <div className="terminal-overlay">
          <Typed
            strings={[
              "Initializing Cyber Defense Terminal...",
              "Running Security Protocols...",
              "Decrypting Access Control Systems...",
            ]}
            typeSpeed={35}
            backSpeed={15}
            loop={false}
          />

          {/* Mode Selection */}
          {mode === "choose" && (
            <motion.div className="mode-selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2>Choose Access Mode</h2>
              <div className="button-group">
                <button onClick={() => setMode("member")}>Member Login</button>
                <button onClick={() => setMode("admin")}>Admin Login</button>
              </div>
            </motion.div>
          )}

          {/* Member Login */}
          {mode === "member" && (
            <motion.div className="login-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3>Decrypt the Transmission:</h3>
              <AnimatePresence>
                {showBinary && (
                  <motion.p
                    className="binary-display"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {binaryPhrase}
                  </motion.p>
                )}
              </AnimatePresence>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Enter decoded phrase..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
                <button type="submit">Submit</button>
              </form>
              <button className="back-btn" onClick={() => setMode("choose")}>Back</button>
            </motion.div>
          )}

          {/* Admin Login */}
          {mode === "admin" && (
            <motion.div className="login-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3>Admin Access Only</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="password"
                  placeholder="Enter Admin Password..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
                <button type="submit">Login</button>
              </form>
              <button className="back-btn" onClick={() => setMode("choose")}>Back</button>
            </motion.div>
          )}

          <AnimatePresence>
            {access && (
              <motion.div
                className={`access-message ${access}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {access === "granted" ? "ACCESS GRANTED" : "ACCESS DENIED"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default HackerScreen;




