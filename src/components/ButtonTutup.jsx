import React from "react";

const ButtonTutup = ({ label, children, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
    >
      {children || label}
    </button>
  );
};

export default ButtonTutup;
