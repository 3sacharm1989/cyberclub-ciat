import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/StoreContext";
import Navbar from "./Navbar";
import CartSidebar from "./CartSidebar";
import "./StorePage.css";

const mockProducts = [
  {
    id: "1",
    name: "CIAT Cyber Hoodie",
    category: "Apparel",
    price: 49.99,
    image: "/merch/hoodie.webp",
    description: "Stay encrypted and warm. Soft black hoodie with CIAT Cyber logo.",
  },
  {
    id: "2",
    name: "Kodi Vinyl Sticker Pack",
    category: "Stickers",
    price: 7.99,
    image: "/merch/stickers.webp",
    description: "Five holographic Kodi bear stickers for your laptop or gear.",
  },
  {
    id: "3",
    name: "Encrypted Mug",
    category: "Accessories",
    price: 14.99,
    image: "/merch/mug.webp",
    description: "Keep your coffee hot and your connections secure.",
  },
  {
    id: "4",
    name: "USB Data Defender Keychain",
    category: "Tech",
    price: 19.99,
    image: "/merch/keychain.webp",
    description: "Carry your keys and your security—anywhere.",
  },
];

export default function StorePage() {
  const [products, setProducts] = useState(mockProducts);
  const [category, setCategory] = useState("All");
  const [adminMode, setAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const { addToCart, setCartOpen } = useStore();

  const cartIconRef = useRef(null);
  const canvasRef = useRef(null);
  const [intensity, setIntensity] = useState(1);

  // View toggle: "bubbles" or "cards"
  const [viewMode, setViewMode] = useState("bubbles");

  /* ---------------- Cipher Rain Background (kept visible) ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*";
    const fontSize = 16;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);
    let driftY = 0;

    const draw = () => {
      // very light fade so background stays visible through content
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const glow = Math.min(intensity, 3);
      ctx.fillStyle = `rgba(0, ${120 + glow * 40}, 255, 0.85)`;
      ctx.shadowBlur = 6 * glow;
      ctx.shadowColor = "#00ffff";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }

      // subtle scanline
      ctx.fillStyle = "rgba(0,255,255,0.08)";
      ctx.fillRect(0, driftY, canvas.width, 2);
      driftY = (driftY + 1) % canvas.height;

      // cool down
      if (intensity > 1) setIntensity((prev) => Math.max(1, prev - 0.02));
    };

    const interval = setInterval(draw, 35);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [intensity]);

  const pulseEffect = () => setIntensity(3);

  /* ---------------- Add to Cart: animation + sound ---------------- */
  const handleAddToCart = (product, e) => {
    addToCart(product);
    setCartOpen(true);
    pulseEffect();

    // pulse SFX (fail silently if blocked)
    const audio = new Audio("/sounds/cyber-pulse.mp3");
    audio.volume = 0.2;
    audio.play().catch(() => {});

    const img = e.currentTarget.closest(".product-card, .bubble-node")?.querySelector("img");
    if (!img || !cartIconRef.current) return;

    const clone = img.cloneNode();
    const rect = img.getBoundingClientRect();
    clone.style.position = "fixed";
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.zIndex = 9999;
    clone.style.borderRadius = getComputedStyle(img).borderRadius || "0px";
    clone.style.transition = "all 0.9s ease-in-out";
    document.body.appendChild(clone);

    const cartRect = cartIconRef.current.getBoundingClientRect();
    requestAnimationFrame(() => {
      clone.style.left = `${cartRect.left}px`;
      clone.style.top = `${cartRect.top}px`;
      clone.style.width = "40px";
      clone.style.height = "40px";
      clone.style.opacity = "0";
    });

    setTimeout(() => clone.remove(), 1000);
    createParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const createParticleBurst = (x, y) => {
    const container = document.createElement("div");
    container.className = "particle-container";
    document.body.appendChild(container);

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      container.appendChild(particle);

      const angle = Math.random() * 2 * Math.PI;
      const velocity = 2 + Math.random() * 4;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity;

      particle.animate(
        [
          { transform: "translate(0,0)", opacity: 1 },
          { transform: `translate(${dx * 30}px, ${dy * 30}px)`, opacity: 0 },
        ],
        { duration: 800, easing: "ease-out" }
      );
    }
    setTimeout(() => container.remove(), 1000);
  };

  /* ---------------- Admin mock add ---------------- */
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Apparel",
    price: "",
    image: "",
    description: "",
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return alert("Please fill in all fields");
    const item = {
      id: Date.now().toString(),
      ...newProduct,
      price: parseFloat(newProduct.price),
    };
    setProducts((prev) => [...prev, item]);
    alert("✅ Product added (mock)");
    setNewProduct({
      name: "",
      category: "Apparel",
      price: "",
      image: "",
      description: "",
    });
  };

  /* ---------------- Filtering ---------------- */
  const filtered = useMemo(
    () => (category === "All" ? products : products.filter((p) => p.category === category)),
    [category, products]
  );

  /* ---------------- Bubble Chart Layout (no extra deps) ---------------- */
  // R scales bubble size by price (min->max mapped to [44..92] px diameter)
  const bubbleContainerRef = useRef(null);
  const { positions, diameters } = useMemo(() => {
    const minD = 44;
    const maxD = 92;
    const minPrice = Math.min(...filtered.map((p) => p.price));
    const maxPrice = Math.max(...filtered.map((p) => p.price));
    const lerp = (a, b, t) => a + (b - a) * t;
    const scaleD = (price) =>
      minPrice === maxPrice ? (minD + maxD) / 2 : lerp(minD, maxD, (price - minPrice) / (maxPrice - minPrice));

    const containerSize = 560; // fallback used for initial calc; CSS clamps handle responsiveness
    const cx = containerSize / 2;
    const cy = containerSize / 2;

    // simple multi-ring layout: biggest center, rest around rings
    const sorted = [...filtered].sort((a, b) => b.price - a.price);
    const radii = sorted.map((p) => scaleD(p.price) / 2);
    const ringGap = 90;

    const pos = [];
    if (sorted.length === 0) return { positions: [], diameters: [] };

    // center first
    pos.push({ x: cx, y: cy });

    let placed = 1;
    let ring = 1;
    while (placed < sorted.length) {
      const remaining = sorted.length - placed;
      const slots = Math.min(remaining, 8 + ring * 4); // wide-ish distribution per ring
      const R = ring * ringGap + 70;
      for (let i = 0; i < slots && placed < sorted.length; i++) {
        const angle = (i / slots) * Math.PI * 2;
        const x = cx + Math.cos(angle) * R;
        const y = cy + Math.sin(angle) * R;
        pos.push({ x, y });
        placed++;
      }
      ring++;
    }

    const diams = sorted.map((p) => scaleD(p.price));
    // reorder positions back to filtered order
    const toIndex = new Map(sorted.map((p, i) => [p.id, i]));
    const outPos = filtered.map((p) => pos[toIndex.get(p.id)]);
    const outD = filtered.map((p) => diams[toIndex.get(p.id)]);
    return { positions: outPos, diameters: outD };
  }, [filtered]);

  return (
    <div className="store-page">
      {/* Cipher canvas fixed behind everything */}
      <canvas ref={canvasRef} className="cipher-canvas" />
      <Navbar />

      <motion.button
        className="back-to-dashboard"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => (window.location.href = "/")}
      >
        ⬅ Back to Dashboard
      </motion.button>

      <motion.header
        className="store-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="glow-text">🧠 CIAT Cyber Vault</h1>
        <p className="tagline">Unlock exclusive gear — built for cybersecurity warriors.</p>
      </motion.header>

      {/* Category + View Toggle */}
      <div className="toolbar">
        <div className="category-bar">
          {["All", ...new Set(products.map((p) => p.category))].map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? "active" : ""}`}
              onClick={() => {
                setCategory(cat);
                pulseEffect();
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "bubbles" ? "active" : ""}`}
            onClick={() => setViewMode("bubbles")}
          >
            Chart Bubble
          </button>
          <button
            className={`toggle-btn ${viewMode === "cards" ? "active" : ""}`}
            onClick={() => setViewMode("cards")}
          >
            Cards
          </button>
        </div>
      </div>

      {/* ----- Bubble Chart View ----- */}
      {viewMode === "bubbles" && (
        <section className="chart-bubble-wrap">
          <div className="chart-bubble" ref={bubbleContainerRef}>
            <div className="chart-bubble-glow" />
            {filtered.length === 0 && <p className="no-products">No products found.</p>}
            {filtered.map((product, i) => {
              const d = diameters[i] || 64;
              const left = (positions[i]?.x || 280) - d / 2;
              const top = (positions[i]?.y || 280) - d / 2;

              return (
                <motion.button
                  key={product.id}
                  className="bubble-node"
                  style={{
                    width: d,
                    height: d,
                    left,
                    top,
                  }}
                  whileHover={{ scale: 1.06 }}
                  onMouseEnter={pulseEffect}
                  onClick={(e) => handleAddToCart(product, e)}
                  title={`Add ${product.name} to cart`}
                >
                  <img
                    src={process.env.PUBLIC_URL + (product.image || "/merch/placeholder.png")}
                    alt={product.name}
                    onError={(e) =>
                      (e.currentTarget.src = process.env.PUBLIC_URL + "/merch/placeholder.png")
                    }
                  />
                  <span className="bubble-label">
                    {product.name} • ${product.price.toFixed(2)}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <p className="chart-hint">Click a bubble to add to your Vault 🛒</p>
        </section>
      )}

      {/* ----- Card Grid View ----- */}
      {viewMode === "cards" && (
        <div className="product-grid">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              className="product-card"
              whileHover={{ scale: 1.05 }}
              onMouseEnter={pulseEffect}
            >
              <div className="card-glow" />
              <img
                src={process.env.PUBLIC_URL + (product.image || "/merch/placeholder.png")}
                alt={product.name}
                onError={(e) =>
                  (e.currentTarget.src = process.env.PUBLIC_URL + "/merch/placeholder.png")
                }
              />
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <p className="price">${product.price.toFixed(2)}</p>
              <button onClick={(e) => handleAddToCart(product, e)}>Add to Vault 🛒</button>
            </motion.div>
          ))}
          {filtered.length === 0 && <p className="no-products">No products found.</p>}
        </div>
      )}

      {/* ---- Admin ---- */}
      <section className="admin-section">
        {!adminMode ? (
          <div className="admin-login">
            <input
              type="password"
              placeholder="Admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            <button
              onClick={() => {
                if (adminPassword === "ciatadmin") setAdminMode(true);
                else alert("❌ Incorrect password");
              }}
            >
              Access Admin Panel
            </button>
          </div>
        ) : (
          <form className="admin-panel" onSubmit={handleAddProduct}>
            <h3>Admin Add Product</h3>
            <input
              type="text"
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            >
              {["Apparel", "Stickers", "Accessories", "Tech"].map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
            <button type="submit">Add Product</button>
          </form>
        )}
      </section>

      <footer className="store-footer">
        <p>
          Want official CIAT merch?{" "}
          <a href="https://store.ciat.edu/" target="_blank" rel="noopener noreferrer">
            Visit the School Store
          </a>
        </p>
      </footer>

      <motion.div
        ref={cartIconRef}
        className="floating-cart"
        whileHover={{ scale: 1.2 }}
        onClick={() => setCartOpen(true)}
      >
        🛒
      </motion.div>

      <CartSidebar />
    </div>
  );
}
