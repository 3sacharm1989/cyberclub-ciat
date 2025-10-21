import React from "react";
import { useStore } from "../store/StoreContext";
import "./StorePage.css";

export default function ProductCard({ product }) {
  const { addToCart } = useStore();
  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <img src={product.image} alt={product.name} onError={(e)=>{e.currentTarget.src="/merch/placeholder.png"}} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-desc">{product.desc}</p>
        <div className="product-meta">
          <span className="pill">{product.category}</span>
          <span className="price">${product.price.toFixed(2)}</span>
        </div>
        <button className="btn" onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    </div>
  );
}
