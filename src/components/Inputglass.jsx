import React from "react";

const Inputglass = ({ 
  type = "text", 
  placeholder = "", 
  value, 
  onChange, 
  className = "", 
  label = "", 
  id = "input"
}) => {
  return (
    <div className={`max-w-sm ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium mb-2 text-white"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 shadow-sm"
          placeholder={placeholder}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-5 rounded-lg pointer-events-none" />
      </div>
    </div>
  );
};

export default Inputglass;