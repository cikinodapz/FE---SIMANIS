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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md text-center w-4/5 md:w-3/5 p-6 rounded-lg shadow-lg">
            <img src={logo} alt="Logo" className="h-24 w-auto mx-auto mt-6" />
            <h1 className="text-4xl font-bold text-white italic mt-6">
              Badan Pusat Statistik
            </h1>
            <h1 className="text-4xl font-bold text-white italic">
              Sumatera Barat
            </h1>
            <p className="mt-8 text-white text-sm px-4 text-left">
              Daftarkan diri Anda untuk mengikuti program magang yang bermanfaat
              di Badan Pusat Statistik Sumatera Barat.
            </p>
            <div className="mt-16 text-white text-sm px-4 text-left">
              <p>
                Sudah Punya Akun?{" "}
                <Link to="/login" className="font-medium hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
            <h1 className="text-3xl text-blue-600 font-bold mb-8 text-center">
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
                label="NIM"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                placeholder="Masukkan NIM"
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
