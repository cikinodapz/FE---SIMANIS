import { useState } from "react";
import blue from "/assets/blue.jpg";
import Input from "../components/Input";
import Button from "../components/Button";
import logo from "/assets/logo.png";
import Swal from "sweetalert2"; // Import sweetalert2
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterKelompok = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    instansi: "",
    nama_ketua: "",
    email: "",
    jumlah_anggota: "",
  });
  const [files, setFiles] = useState({
    surat_pengantar: null,
    surat_balasan: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    setFiles((prev) => ({
      ...prev,
      [id]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate file types first
    const allowedFileType = "application/pdf";
    if (files.surat_pengantar && files.surat_pengantar.type !== allowedFileType) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Format File Tidak Sesuai',
        html: `
          <div class="p-4">
            <p class="text-gray-800">
              Surat Pengantar harus berformat PDF.
            </p>
            <div class="mt-3 text-sm text-gray-600">
              Silakan upload ulang file dengan format yang sesuai.
            </div>
          </div>
        `,
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title text-xl font-bold text-gray-800 mb-4',
        },
        confirmButtonText: 'Mengerti',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    if (files.surat_balasan && files.surat_balasan.type !== allowedFileType) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Format File Tidak Sesuai',
        html: `
          <div class="p-4">
            <p class="text-gray-800">
              Surat Balasan harus berformat PDF.
            </p>
            <div class="mt-3 text-sm text-gray-600">
              Silakan upload ulang file dengan format yang sesuai.
            </div>
          </div>
        `,
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title text-xl font-bold text-gray-800 mb-4',
        },
        confirmButtonText: 'Mengerti',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("nama_ketua", formData.nama_ketua);
      formDataToSend.append("jumlah_anggota", formData.jumlah_anggota);
      formDataToSend.append("instansi", formData.instansi);
      formDataToSend.append("surat_pengantar", files.surat_pengantar);
      formDataToSend.append("surat_balasan", files.surat_balasan);

      const response = await axios.post(
        "https://web-baru.up.railway.app/peserta/group-register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Registrasi Berhasil!",
          html: `
            <div class="p-4">
              <div class="mb-4">
                <p class="font-semibold text-lg text-gray-800">
                  Selamat! Kelompok Anda telah berhasil terdaftar sebagai peserta magang di Badan Pusat Statistik Sumatera Barat.
                </p>
              </div>
       
              <div class="bg-blue-50 p-4 rounded-lg mb-4">
                <p class="text-blue-800 font-medium mb-2">
                  Langkah Selanjutnya:
                </p>
                <ul class="text-left text-blue-700 list-disc pl-4 space-y-2">
                  <li>Silakan periksa email Anda secara berkala untuk informasi status persetujuan pendaftaran</li>
                  <li>Proses verifikasi dan persetujuan membutuhkan waktu 1-3 hari kerja</li>
                  <li>Setelah disetujui, Anda akan menerima email konfirmasi beserta nomor kelompok untuk register sebagai peserta</li>
                </ul>
              </div>
       
              <div class="text-sm text-gray-600 italic">
                Jika Anda memiliki pertanyaan, silakan hubungi kami melalui email support@bps.go.id
              </div>
            </div>
          `,
          customClass: {
            container: "custom-swal-container",
            popup: "custom-swal-popup",
            title: "custom-swal-title text-2xl font-bold text-gray-800 mb-4",
            htmlContainer: "custom-swal-html",
            confirmButton: "custom-swal-confirm-btn",
          },
          confirmButtonText: "Mengerti",
          confirmButtonColor: "#2563eb",
          showClass: {
            popup: "animate__animated animate__fadeInDown animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp animate__faster",
          },
        }).then(() => {
          // Reset form state
          setFormData({
            instansi: "",
            nama_ketua: "",
            email: "",
            jumlah_anggota: "",
          });

          // Reset file state
          setFiles({
            surat_pengantar: null,
            surat_balasan: null,
          });

          // Reset file inputs
          const fileInputs = document.querySelectorAll('input[type="file"]');
          fileInputs.forEach((input) => {
            input.value = "";
          });

          // Redirect to login
          navigate("/registerPeserta");
        });
      }
    } catch (error) {
      console.error("Error detail:", error);
      
      // Show error SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        html: `
          <div class="p-4">
            <p class="text-gray-800">
              ${error.response?.data?.error || "Terjadi kesalahan saat mendaftar"}
            </p>
            <div class="mt-3 text-sm text-gray-600">
              Silakan coba lagi atau hubungi administrator jika masalah berlanjut.
            </div>
          </div>
        `,
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title text-xl font-bold text-gray-800 mb-4',
        },
        confirmButtonText: 'Mengerti',
        confirmButtonColor: '#2563eb',
      });
      
      setError(error.response?.data?.error || "Terjadi kesalahan saat mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2  w-screen max-h-[50rem] h-auto mx-auto">
      <div className="relative bg-blue-300 h-screen">
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
            <h1 className="text-3xl font-bold text-white italic mt-7">
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
                to="/registerPeserta"
                className="text-white font-medium hover:underline"
              >
                Register Peserta
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-500">
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
          <div className="bg-white/100 backdrop-blur-md shadow-lg rounded-lg p-6 w-full max-w-md">
            <h1 className="text-3xl text-blue-premier font-bold mb-10 text-center text-shadow-md">
              Register Kelompok
            </h1>
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Input
                  label="Institusi"
                  id="instansi"
                  value={formData.instansi}
                  onChange={handleInputChange}
                  placeholder="Masukkan Asal Institusi"
                  className="border-blue-premier text-blue-premier"
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Ketua"
                  id="nama_ketua"
                  value={formData.nama_ketua}
                  onChange={handleInputChange}
                  placeholder="Masukkan Nama Ketua Tim"
                  className="border-blue-premier"
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Email"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan Email Ketua Kelompok"
                  className="border-blue-premier"
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Anggota"
                  id="jumlah_anggota"
                  type="number"
                  value={formData.jumlah_anggota}
                  onChange={handleInputChange}
                  placeholder="Masukkan Jumlah Anggota Kelompok"
                  className="border-blue-premier"
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Surat Pengantar"
                  id="surat_pengantar"
                  type="file"
                  onChange={handleFileChange}
                  placeholder="Upload Surat Pengantar"
                  className="border-blue-premier"
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Surat Balasan"
                  id="surat_balasan"
                  type="file"
                  onChange={handleFileChange}
                  placeholder="Upload Surat Balasan"
                  className="border-blue-premier"
                />
              </div>
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  label={loading ? "Loading..." : "Register"}
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterKelompok;
