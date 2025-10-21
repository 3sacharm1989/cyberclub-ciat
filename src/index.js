import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { StoreProvider } from "./store/StoreContext"; 

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* Wrap your entire app with StoreProvider */}
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);


// reportWebVitals();

