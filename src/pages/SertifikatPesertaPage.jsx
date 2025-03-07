import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { Loader, FileText, Clock, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";
import { DarkModeContext } from "../context/DarkModeContext";

const SertifikatPeserta = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [certificateStatus, setCertificateStatus] = useState(null);

  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    fetchCertificate();
  }, []);

  const fetchCertificate = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://web-baru.up.railway.app/peserta/preview-sertif",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      if (response.headers["content-type"] === "application/pdf") {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfData(url);
        setCertificateStatus("available");
      } else {
        const text = await response.data.text();
        const jsonResponse = JSON.parse(text);
        if (jsonResponse.status === "Pending") {
          setCertificateStatus("pending");
        } else {
          setCertificateStatus("not_available");
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching certificate:", error);
      if (error.response?.status === 404) {
        setCertificateStatus("not_available");
      } else if (error.response?.status === 400) {
        setCertificateStatus("pending");
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
        "https://web-baru.up.railway.app/peserta/preview-sertif",
        {
          headers: { Authorization: `Bearer ${token}` },
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

      Swal.fire({
        icon: "success",
        title: "Sertifikat Berhasil Diunduh! 🎉",
        html: `
          <div>
            <p class="${darkMode ? 'text-gray-300' : 'text-gray-600'}">Selamat! Sertifikat magang Anda telah berhasil diunduh.</p>
            <p class="text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600/90'} mt-2">Dokumen penting ini mencatat pencapaian dan kerja keras Anda selama program magang.</p>
          </div>
        `,
        confirmButtonColor: `${darkMode ? '#2563eb' : 'rgb(37, 99, 235, 0.9)'}`,
        confirmButtonText: "Claim Sertifikat",
        footer: `<span class="text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}">📄✨ Dokumentasikan pencapaian Anda!</span>`,
        grow: "softly",
        backdrop: true,
        background: `${darkMode ? '#1f2937' : '#f8fafc'}`,
      });
    } catch (error) {
      console.error("Error downloading certificate:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal Mengunduh Sertifikat",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mengunduh sertifikat. Silakan coba lagi.",
        confirmButtonColor: `${darkMode ? '#dc2626' : '#d33'}`,
        confirmButtonText: "Tutup",
        background: `${darkMode ? '#1f2937' : '#fff'}`,
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
          <Loader className={`w-8 h-8 animate-spin ${darkMode ? 'text-blue-400' : 'text-blue-600/90'}`} />
          <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Memuat sertifikat...</span>
        </div>
      );
    }

    if (certificateStatus === "not_available") {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <FileText className={`w-16 h-16 mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600/90'} opacity-50`} />
          <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Sertifikat Belum Tersedia
          </h2>
          <p className={`text-center max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
            Sertifikat Anda akan tersedia setelah menyelesaikan seluruh program magang dan mendapatkan persetujuan dari pembimbing.
          </p>
          <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600/90'}`}>
            Silakan selesaikan semua tugas dan aktivitas yang diperlukan.
          </p>
        </div>
      );
    }

    if (certificateStatus === "pending") {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <Clock className={`w-16 h-16 mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600/90'} opacity-50`} />
          <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Sertifikat Dalam Proses
          </h2>
          <p className={`text-center max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
            Sertifikat Anda sedang dalam proses pembuatan dan verifikasi. Mohon tunggu beberapa waktu.
          </p>
          <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600/90'}`}>
            Kami akan memberitahu Anda segera setelah sertifikat siap melalui email anda.
          </p>
        </div>
      );
    }

    if (certificateStatus === "error") {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <AlertCircle className={`w-16 h-16 mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'} opacity-50`} />
          <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Terjadi Kesalahan
          </h2>
          <p className={`text-center max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {error || "Mohon maaf, terjadi kesalahan saat memuat sertifikat. Silakan coba lagi nanti."}
          </p>
        </div>
      );
    }

    return (
      pdfData && (
        <div className="w-[1077px] h-[736px] rounded-lg overflow-hidden relative" style={{ overscrollBehavior: "none" }}>
          <iframe
            src={`${pdfData}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="w-full h-full absolute inset-0"
            style={{
              border: "none",
              backgroundColor: darkMode ? "#1f2937" : "white",
              overflow: "hidden",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          />
        </div>
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300 overflow-hidden">
      <Sidebar />
      <div className="flex-1 md:ml-[250px] overflow-hidden">
        <Navbar />
        <div className="p-8 lg:p-12 mt-20 max-w-6xl mx-auto overflow-hidden">
          <div className="shadow-lg p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm transition-colors duration-300 overflow-hidden">
            <div className="min-h-[700px] relative overflow-hidden">{renderContent()}</div>

            {certificateStatus === "available" && (
              <div className="flex justify-center font-medium mt-3">
                <Button
                  label="Download Sertifikat"
                  className={`bg-gradient-to-r ${darkMode ? 'from-blue-700 to-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700' : 'from-blue-600/90 to-blue-800 hover:from-blue-800 hover:to-blue-600/90'} text-white border-2 ${darkMode ? 'border-blue-700 dark:hover:border-blue-800' : 'border-blue-600/90 hover:border-blue-800'} disabled:bg-gray-400 disabled:border-gray-400 transition-all duration-300 transform shadow-lg hover:shadow-xl`}
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