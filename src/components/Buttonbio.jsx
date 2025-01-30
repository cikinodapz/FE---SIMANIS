import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  disabled = false,
  type = "button",
  className = ""
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-500 text-white rounded-md
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} 
        ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;