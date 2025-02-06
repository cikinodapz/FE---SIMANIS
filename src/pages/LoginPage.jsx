import { useState } from "react";
import blue from "../assets/blue.jpg";
import Input from "../components/Inputglass";
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
  const [isResetMode, setIsResetMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

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
               <div class="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                 <i class="fas fa-check text-4xl text-white"></i>
               </div>
             </div>
  
             <div class="text-center mb-6">
               <h2 class="text-2xl font-bold text-gray-800 mb-2 animate-fade-in">
                 Selamat Datang Kembali!
               </h2>
               <p class="text-lg text-gray-600">
                 di Sistem Informasi Magang BPS Sumatera Barat
               </p>
             </div>
  
             <div class="relative pt-1 mb-6">
               <div class="flex mb-2 items-center justify-between">
                 <div class="text-right">
                 </div>
               </div>
               <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                 <div class="progress-bar shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-green-500" 
                      style="width: 0%"></div>
               </div>
             </div>
  
             <div class="text-center">
               <p class="text-sm text-gray-600 mb-2">
                 Mengalihkan dalam <span class="font-semibold countdown text-blue-600">3</span> detik
               </p>
               <div class="flex justify-center space-x-1">
                 <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                 <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style="animation-delay: 0.2s"></div>
                 <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style="animation-delay: 0.4s"></div>
               </div>
             </div>
           </div>
         `,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            let count = 3;
            let progress = 0;
            const countdownEl = document.querySelector(".countdown");
            const progressBarEl = document.querySelector(".progress-bar");
            const countdownPercentEl =
              document.querySelector(".countdown-percent");

            const countdown = setInterval(() => {
              count--;
              if (countdownEl) countdownEl.textContent = count;
              if (count <= 0) clearInterval(countdown);
            }, 1000);

            const progressInterval = setInterval(() => {
              progress += 2;
              if (progressBarEl) progressBarEl.style.width = `${progress}%`;
              if (countdownPercentEl) countdownPercentEl.textContent = progress;
              if (progress >= 100) clearInterval(progressInterval);
            }, 20); // Adjust the interval to control the speed of the progress bar
          },
        }).then(() => {
          const userRole = localStorage.getItem("role");
          if (userRole === "User") {
            navigate("/statistik");
          } else if (userRole === "Pegawai") {
            navigate("/profile");
          } else {
            navigate("/dashboard");
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

  // Update the handleSendOTP function
  const handleSendOTP = async () => {
    try {
      Swal.fire({
        title: "Mengirim OTP",
        html: `
        <div class="flex flex-col items-center">
          <div class="mb-4">
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
          <div class="text-gray-600">
            <p class="mb-2">Mohon tunggu sebentar</p>
            <p class="text-sm">Kode OTP sedang dikirim ke email Anda</p>
          </div>
        </div>
      `,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      await axios.post("http://localhost:3000/auth/send-otp", {
        email: resetEmail,
      });

      Swal.fire({
        icon: "success",
        title: "OTP Terkirim!",
        html: `
        <div class="p-4">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <i class="fas fa-envelope-open text-3xl text-green-500"></i>
            </div>
          </div>
          <p class="text-gray-700 mb-2">Kode OTP telah dikirim ke email Anda</p>
          <p class="text-sm text-gray-500">Silakan cek inbox atau folder spam</p>
        </div>
      `,
        timer: 2000,
        showConfirmButton: false,
      });
      setOtpSent(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim OTP",
        html: `
        <div class="p-4">
          <div class="flex justify-center mb-4">
              <i class="fas fa-exclamation-circle text-3xl text-red-500"></i>
            </div>
          </div>
          <p class="text-red-600 mb-2">${
            error.response?.data?.message ||
            "Terjadi kesalahan saat mengirim OTP"
          }</p>
          <p class="text-sm text-gray-600">Silakan periksa email Anda dan coba lagi</p>
        </div>
      `,
      });
    }
  };

  // Update the handleResetPassword function
  const handleResetPassword = async () => {
    try {
      Swal.fire({
        title: "Memperbarui Password",
        html: `
        <div class="flex flex-col items-center">
          <div class="mb-4">
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
          <div class="text-gray-600">
            <p class="mb-2">Sedang memproses</p>
            <p class="text-sm">Mohon tunggu sebentar...</p>
          </div>
        </div>
      `,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      await axios.post("http://localhost:3000/auth/lupa-password", {
        kode: otp,
        newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Password Berhasil Diubah!",
        html: `
        <div class="p-4">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <i class="fas fa-check-circle text-3xl text-green-500"></i>
            </div>
          </div>
          <p class="text-gray-700 mb-2">Password Anda telah berhasil diperbarui</p>
          <p class="text-sm text-gray-500">Silakan login dengan password baru Anda</p>
        </div>
      `,
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        setIsResetMode(false);
        setOtp("");
        setNewPassword("");
        setResetEmail("");
        setOtpSent(false);
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Reset Password",
        html: `
        <div class="p-4">
          <div class="flex justify-center mb-4">
              <i class="fas fa-times-circle text-3xl text-red-500"></i>
            </div>
          </div>
          <p class="text-red-600 mb-2">${
            error.response?.data?.message || "Gagal memperbarui password"
          }</p>
          <p class="text-sm text-gray-600">Silakan periksa kode OTP dan coba lagi</p>
        </div>
      `,
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center "
      style={{ backgroundImage: `url(${blue})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="backdrop-blur-md bg-white/15 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
          <div className="ml-4">
            <h1 className="text-xl font-bold text-white italic">
              BADAN PUSAT STATISTIK
            </h1>
            <h1 className="text-xl font-bold text-white italic">
              PROVINSI SUMATERA BARAT
            </h1>
          </div>
        </div>

        {!isResetMode ? (
          <>
            
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
                  placeholder="Masukkan email Anda"
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
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="py-5">
                <Button
                  variant="premier"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-blue-500 flex justify-center text-center text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Loading..." : "Login"}
                </Button>
              </div>
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
                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="text-white font-medium hover:underline mt-2"
                >
                  Lupa Password?
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
              Reset Password
            </h1>
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  disabled={otpSent}
                />
                {!otpSent && (
                  <Button
                    variant="premier"
                    type="button"
                    onClick={handleSendOTP}
                    className="mt-6 w-full py-2 px-4 bg-blue-500 flex justify-center text-center text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                  >
                    Kirim OTP
                  </Button>
                )}
              </div>

              {otpSent && (
                <>
                  <div>
                    <label className="block text-white font-medium mb-1">
                      Kode OTP
                    </label>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Masukkan kode OTP"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-1">
                      Password Baru
                    </label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan password baru"
                    />
                  </div>

                  <Button
                    variant="premier"
                    type="button"
                    onClick={handleResetPassword}
                    className="w-full py-2 px-4 bg-blue-500 flex justify-center text-center text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                  >
                    Reset Password
                  </Button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setOtp("");
                  setNewPassword("");
                  setResetEmail("");
                  setOtpSent(false);
                }}
                className="text-white hover:underline mt-4 w-full text-center"
              >
                Kembali ke Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

//dah bisa OTP

export default LoginPage;
