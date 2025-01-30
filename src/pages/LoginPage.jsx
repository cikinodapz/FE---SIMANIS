import { useState } from "react";
import blue from "../assets/blue.jpg";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/logo.png";
import axios from "axios";
import Swal from "sweetalert2";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("role", response.data.user?.role);
  
        Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          html: `
            <div class="p-6">
              <div class="flex justify-center mb-6">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <i class="fas fa-check-circle text-3xl text-green-500"></i>
                </div>
              </div>
  
              <div class="text-center mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">
                  Selamat Datang Kembali!
                </h2>
                <p class="text-base text-gray-600">
                  di Sistem Informasi Magang BPS Sumatera Barat
                </p>
              </div>
  
              <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <i class="fas fa-info-circle text-blue-500"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-blue-700">
                      Login berhasil. Tunggu Sebentar...
                    </p>
                  </div>
                </div>
              </div>
  
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
                <span class="ml-2 text-sm text-gray-500">
                  Mengalihkan dalam <span class="font-semibold countdown">3</span> detik
                </span>
              </div>
            </div>
          `,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            let count = 3;
            const countdownEl = document.querySelector('.countdown');
            const countdown = setInterval(() => {
              count--;
              if (countdownEl) countdownEl.textContent = count;
              if (count <= 0) clearInterval(countdown);
            }, 1000);
          },
        }).then(() => {
          const userRole = localStorage.getItem('role');
          if (userRole === 'User') {
            navigate('/biodata');
          } else if (userRole === 'Pegawai') {
            navigate('/form-tugas-pegawai');
          } else {
            navigate('/dashboard');
          }
        });
        
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        html: `
          <div class="p-4">
            <p class="text-red-600">
              ${error.response?.data?.error || "Terjadi kesalahan saat login"}
            </p>
            <div class="mt-3 text-sm text-gray-600">
              Silakan periksa kembali email dan password Anda
            </div>
          </div>
        `,
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${blue})` }}
    >
      <div className="backdrop-blur-md bg-white/15 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-white italic">
              Badan Pusat Statistik
            </h1>
            <h1 className="text-2xl font-bold text-white italic">
              Sumatera Barat
            </h1>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-white font-medium mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              className="block text-white font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button
            variant="premier"
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 flex justify-center text-center text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Login"}
          </Button>
          <div className="mt-4 text-center text-white">
            <p>
              Belum punya akun?{" "}
              <Link
                to="/registerkelompok"
                className="text-white font-medium hover:underline"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
