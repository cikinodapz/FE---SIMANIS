import React, { useState } from "react";
import { Link } from "react-router-dom";  
import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../components/Logo";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [groupCode, setGroupCode] = useState(''); 

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password, groupCode }); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-200"> 
      <form
        onSubmit={handleLogin}
        className="bg-blue-premier p-8 rounded-lg shadow-lg w-full max-w-md" 
      >
        <Logo /> 
        
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">Email</label>
          <Input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">Password</label>
          <Input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-8">
          <label className="block mb-2 text-sm font-medium text-white">Kode Kelompok</label>
          <Input
            type="text"
            placeholder="Masukkan kode kelompok"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
          />
        </div>

        <div className="flex justify-center item-center">
          <Button label="Login"/>
        </div>

        {/* Tautan menuju halaman Register */}
        <div className="mt-4 text-center text-white">
          <p>Belum punya akun? <Link to="/register" className="text-blue-300 hover:underline">Daftar di sini</Link></p>
        </div>
     
      </form>
    </div>
  );
};

export default Login;
