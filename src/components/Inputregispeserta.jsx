// components/Input.jsx
const Input = ({ label, name, value, onChange, placeholder, type = "text", required }) => {
    return (
      <div className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    );
  };
  
  export default Input;