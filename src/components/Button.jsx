import React from "react";
import { Plus } from 'lucide-react'; // Impor ikon Plus dari lucide-react

const Button = ({ label, children, onClick, type = "button", className, variant = "green", ikon }) => {
  const variantClasses = {
    green: "bg-green border-2 border-green hover:bg-white hover:text-green hover:border-green font-medium",
    primary: "bg-blue-premier hover:bg-blue-600 font-medium",
    danger: "bg-red-500 hover:bg-white font-medium border-2 hover:border-red-500 hover:text-red-500",
    oren: "bg-oren hover:bg-white border-2 border-oren hover:text-oren hover:border-oren",
    white: "bg-white text-blue-800 hover:font-bold",
    blue: "bg-blue-sky hover:bg-white hover:border-blue-sky border-2 hover:text-blue-sky font-medium",
    yellow:"bg-yellow-500 hover:bg-white border-2 hover:border-yellow-500 hover:text-yellow-500",
    teal:"bg-teal-100 text-teal-700 border-teal-500"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-bold  transition ${variantClasses[variant]} ${className}`}
    >
      {ikon && <span className="text-lg">{ikon}</span>}
      {children || label}
    </button>
  );
};

export default Button;
