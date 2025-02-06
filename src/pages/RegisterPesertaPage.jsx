import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import blue from "../assets/blue.jpg";
import Input from "../components/Inputregispeserta";
import Button from "../components/Button";
import logo from "../assets/logo.png";
import Swal from "sweetalert2"; // Import SweetAlert2

const RegisterPesertaPage = () => {
  const [formData, setFormData] = useState({
    nomor_kelompok: "",
    email: "",
    password: "",
    nama: "",
    nim: "",
    jurusan: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/peserta/peserta-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Show SweetAlert2 on success
      Swal.fire({
        title: "Pendaftaran Berhasil!",
        text: "Anda telah berhasil mendaftar. Silakan login untuk melanjutkan.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Redirect to login page after successful registration
        navigate("/login");
      });

      // Reset form
      setFormData({
        nomor_kelompok: "",
        email: "",
        password: "",
        nama: "",
        nim: "",
        jurusan: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 w-screen-2xl h-screen mx-auto">
      <div className="relative bg-blue-300">
        <img
          src={blue}
          className="h-full w-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white/10 items-center backdrop-blur-md text-center w-[50%] h-[50%] sm:w-[50%] px-6 py-4 rounded-lg shadow-lg">
            <img
              src={logo}
              alt="Logo"
              className="h-25 w-25 object-contain mx-auto mt-7"
            />
            <h1 className="text-3xl font-bold  text-white italic mt-7">
              BADAN PUSAT STATISTIK
            </h1>
            <h1 className="text-3xl font-bold text-white italic">
              PROVINSI SUMATERA BARAT
            </h1>
            <div className="mt-10 text-white font-small text-sm px-5 text-start">
              Daftarkan diri Anda untuk mengikuti program magang yang bermanfaat
              di Badan Pusat Statistik Sumatera Barat.
            </div>
            <div className="mt-20 text-white font-small text-sm px-5 py-10 text-start">
              <p>Sudah Register Kelompok? Klik disini </p>
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

      <div className="bg-blue-50">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
            <h1 className="text-3xl text-blue-premier font-bold mb-8 text-center">
              Register Peserta
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Nomor Kelompok"
                name="nomor_kelompok"
                value={formData.nomor_kelompok}
                onChange={handleChange}
                placeholder="Masukkan nomor kelompok"
                required
              />

              <Input
                label="Nama Lengkap"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
              />

              <Input
                label="NIM / NISN"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                placeholder="Masukkan NIM / NISN"
                required
              />

              <Input
                label="Jurusan"
                name="jurusan"
                value={formData.jurusan}
                onChange={handleChange}
                placeholder="Masukkan jurusan"
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                required
              />

              <div className="flex justify-center pt-4">
                <Button
                  variant="primary"
                  label={loading ? "Loading..." : "Register"}
                  type="submit"
                  disabled={loading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPesertaPage;
