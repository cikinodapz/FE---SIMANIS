import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { Loader, FileText, Clock, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

const SertifikatPeserta = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [certificateStatus, setCertificateStatus] = useState(null);

  useEffect(() => {
    fetchCertificate();
  }, []);

  const fetchCertificate = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:3000/peserta/preview-sertif",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfData(url);
      setCertificateStatus("available");
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching certificate:", error);
      // Mengecek status error untuk menentukan pesan yang sesuai
      if (error.response?.status === 404) {
        setCertificateStatus("not_available");
      } else if (error.response?.status === 400) {
        setCertificateStatus("in_process");
      } else {
        setCertificateStatus("error");
      }
      setError(error.response?.data?.message || "Gagal memuat sertifikat");
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:3000/peserta/preview-sertif",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sertifikat-magang.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Tambahkan SweetAlert untuk konfirmasi download berhasil
      Swal.fire({
        icon: "success",
        title: "Sertifikat Berhasil Diunduh! 🎉",
        html: `
          <div>
            <p class="text-gray-600">Selamat! Sertifikat magang Anda telah berhasil diunduh.</p>
            <p class="text-sm text-blue-600/90 mt-2">Dokumen penting ini mencatat pencapaian dan kerja keras Anda selama program magang.</p>
          </div>
        `,
        confirmButtonColor: "rgb(37, 99, 235, 0.9)", // Ini adalah nilai RGB untuk blue-600 dengan opacity 0.9
        confirmButtonText: "Claim Sertifikat",
        footer:
          '<span class="text-sm text-gray-500">📄✨ Dokumentasikan pencapaian Anda!</span>',
        grow: "softly",
        backdrop: true,
        background: "#f8fafc",
      });
    } catch (error) {
      console.error("Error downloading certificate:", error);

      // Gunakan SweetAlert untuk error
      Swal.fire({
        icon: "error",
        title: "Gagal Mengunduh Sertifikat",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mengunduh sertifikat. Silakan coba lagi.",
        confirmButtonColor: "#d33",
        confirmButtonText: "Tutup",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (pdfData) {
        URL.revokeObjectURL(pdfData);
      }
    };
  }, [pdfData]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600/90" />
          <span className="ml-2 text-gray-600">Memuat sertifikat...</span>
        </div>
      );
    }

    if (certificateStatus === "not_available") {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-6">
          <FileText className="w-16 h-16 mb-4 text-blue-600/90 opacity-50" />
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Sertifikat Belum Tersedia
          </h2>
          <p className="text-center max-w-md text-gray-500 mb-2">
            Sertifikat Anda akan tersedia setelah menyelesaikan seluruh program
            magang dan mendapatkan persetujuan dari pembimbing.
          </p>
          <p className="text-sm text-blue-600/90">
            Silakan selesaikan semua tugas dan aktivitas yang diperlukan.
          </p>
        </div>
      );
    }

    if (certificateStatus === "in_process") {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-6">
          <Clock className="w-16 h-16 mb-4 text-blue-600/90 opacity-50" />
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Sertifikat Dalam Proses
          </h2>
          <p className="text-center max-w-md text-gray-500 mb-2">
            Sertifikat Anda sedang dalam proses pembuatan dan verifikasi. Mohon
            tunggu beberapa waktu.
          </p>
          <p className="text-sm text-blue-600/90">
            Kami akan memberitahu Anda segera setelah sertifikat siap melalui
            email anda.
          </p>
        </div>
      );
    }

    if (certificateStatus === "error") {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-6">
          <AlertCircle className="w-16 h-16 mb-4 text-red-500 opacity-50" />
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Terjadi Kesalahan
          </h2>
          <p className="text-center max-w-md text-gray-500">
            {error ||
              "Mohon maaf, terjadi kesalahan saat memuat sertifikat. Silakan coba lagi nanti."}
          </p>
        </div>
      );
    }

    return (
      pdfData && (
        <embed
          src={pdfData}
          type="application/pdf"
          className="w-full h-[700px] rounded-lg"
        />
      )
    );
  };

  return (
    <div className="flex max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] h-screen">
        <Navbar />
        <div className="p-[40px]">
          <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            {/* <h1 className="text-blue-premier text-3xl font-bold">Sertifikat</h1>
            <p className="text-sm text-gray-500">Sertifikat Magang</p> */}

            <div className="mt-10 bg-gray-100 rounded-lg min-h-[700px] relative">
              {renderContent()}
            </div>

            {certificateStatus === "available" && (
              <div className="flex justify-center font-medium mt-3">
                <Button
                  label="Download Sertifikat"
                  className="bg-gradient-to-r from-blue-600/90 to-blue-800 text-white hover:from-blue-800 hover:to-blue-600/90 disabled:bg-gray-400 transition-all duration-300 transform  shadow-lg hover:shadow-xl border-2 border-blue-600/90 hover:border-blue-800"
                  onClick={handleDownload}
                  disabled={isLoading || !pdfData}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SertifikatPeserta;
