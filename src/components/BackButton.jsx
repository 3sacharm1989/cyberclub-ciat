import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Optional: yarn add lucide-react for icons
import "./BackButton.css";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate("/")}>
      <ArrowLeft size={18} className="back-icon" />
      Back to Dashboard
    </button>
  );
};

export default BackButton;
