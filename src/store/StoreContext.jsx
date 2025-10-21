import React, { createContext, useContext, useState, useEffect } from "react";

/* ------------------- Create Context ------------------- */
const StoreContext = createContext();

export function StoreProvider({ children }) {
  /* --- Cart State --- */
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  /* --- Load Cart from Local Storage --- */
  useEffect(() => {
    const saved = localStorage.getItem("ciat_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  /* --- Persist Cart --- */
  useEffect(() => {
    localStorage.setItem("ciat_cart", JSON.stringify(cart));
  }, [cart]);

  /* ------------------- Cart Functions ------------------- */
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, amount) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  /* --- Cart Totals --- */
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartTotal = cart
    .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
    .toFixed(2);

  /* ------------------- Context Value ------------------- */
  const value = {
    cart,
    cartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    setCartOpen,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/* ------------------- Custom Hook ------------------- */
export const useStore = () => useContext(StoreContext);