import React, { useState } from "react";
import blue from "../assets/blue.jpg";
import Input from "../components/Input";
import Button from "../components/Button";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";


const RegisterPesertaPage = () => {
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
        <div className="grid grid-cols-2  max-w-[95rem] max-h-[50rem] h-auto mx-auto">
          <div className="relative bg-blue-300 h-screen">
      <img
        src={blue}
        className="h-full w-full object-cover"
        alt="Background"
      />
    
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-white/10 items-center backdrop-blur-md text-center w-[80%] h-[60%] sm:w-[60%] px-6 py-4 rounded-lg shadow-lg">
        <img src={logo} alt="Logo" className="h-25 w-25 object-contain mx-auto mt-7" />
        <h1 className="text-4xl font-bold text-white italic mt-7">
          Badan Pusat Statistik
        </h1>
        <h1 className="text-4xl font-bold text-white italic">
          Sumatera Barat
        </h1>
        <div className="mt-10 text-white font-small text-sm px-5 text-start">
          Daftarkan diri Anda untuk mengikuti program magang yang bermanfaat di Badan Pusat Statistik Sumatera Barat.
        </div>
        <div className="mt-20 text-white font-small text-sm px-5 text-start">
    <p>
              Sudah Punya Akun? Klik disini{" "}
              
            </p>
            <Link
                to="/login"
                className="text-white font-medium hover:underline"
              >
                Login
              </Link>
    </div>
      </div>
    </div>
    
    
    
    
    </div>
    
    
          <div className="bg-blue-500">
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
              <div className="bg-white/100 backdrop-blur-md shadow-lg rounded-lg p-6 w-full max-w-md">
                <h1 className="text-3xl text-blue-premier font-bold mb-10 text-center text-shadow-md">
                  Register Peserta
                </h1>
                <div className="mb-4">
                  <Input label="Nama" placeholder="Masukkan Asal Institusi" className="border-blue-premier text-blue-premier" />
                </div>
                <div className="mb-4">
                  <Input label="Email" placeholder="Masukkan Nama Ketua Tim" className="border-blue-premier" />
                </div>
                <div className="mb-4">
                  <Input label="Kode Kelompok" placeholder="Masukkan Email Ketua Tim" className="border-blue-premier" />
                </div>
                
                <div className="flex justify-center">
                  <Button variant="primary" label="Register" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
};

export default RegisterPesertaPage;
