import React from "react";

const Input = ({ 
  type = "text", 
  placeholder = "", 
  value, 
  onChange, 
  className = "", 
  label = "", 
  id = "input", 
  px = 12, 
  borderColor = "gray-300",   
}) => {
  return (
    <div className={`max-w-sm ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium mb-2 text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={`py-3 px-2 block w-full border border-${borderColor} rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
