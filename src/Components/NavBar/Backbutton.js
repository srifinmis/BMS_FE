// Components/NavBar/Backbutton.js
import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ isDropped }) => {
  const navigate = useNavigate();

  return (
    <button
      style={{
        position: "fixed",
        left: isDropped ? "90px" : "265px",
        top: "65px",
        padding: "8px 12px",
        borderRadius: "6px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        zIndex: 998,
        transition: "left 0.1s ease", 
      }}
      onClick={() => navigate(-1)}
    >
      ⬅ Back
    </button>
  );
};

export default BackButton;
