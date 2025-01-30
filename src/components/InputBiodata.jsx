import React from "react";

const Input = ({ name, value, onChange, placeholder, label, type = "text", className }) => {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };
  
  export default Input;