import React, { useState } from "react";
import { Link } from "react-router-dom";  // Import Link untuk navigasi
import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../components/Logo";

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [institusi, setInstitusi] = useState('');
  const [jurusan, setJurusan] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', { email, nim, nama, institusi, jurusan });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-200">
      <form
        onSubmit={handleRegister}
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
          <label className="block mb-2 text-sm font-medium text-white">NIM</label>
          <Input
            type="text"
            placeholder="Masukkan NIM"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">Nama</label>
          <Input
            type="text"
            placeholder="Masukkan nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">Institusi</label>
          <Input
            type="text"
            placeholder="Masukkan institusi"
            value={institusi}
            onChange={(e) => setInstitusi(e.target.value)}
          />
        </div>

        <div className="mb-8">
          <label className="block mb-2 text-sm font-medium text-white">Jurusan</label>
          <Input
            type="text"
            placeholder="Masukkan jurusan"
            value={jurusan}
            onChange={(e) => setJurusan(e.target.value)}
          />
        </div>
        
        <div className="flex justify-center item-center">
          <Button label="Daftar" />
        </div>

        {/* Tautan menuju halaman Login */}
        <div className="mt-4 text-center text-white">
          <p>Sudah punya akun? <Link to="/login" className="text-blue-300 hover:underline">Login di sini</Link></p>
        </div>
     
      </form>
    </div>
  );
};

export default RegisterPage;
