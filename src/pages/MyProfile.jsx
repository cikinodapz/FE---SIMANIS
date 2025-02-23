import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Camera, Pencil, User } from "lucide-react";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { DarkModeContext } from "../context/DarkModeContext";

const Profile = () => {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pesertaData, setPesertaData] = useState(null);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); // Gunakan context
  const token = localStorage.getItem("accessToken");
  const decodedToken = token ? jwtDecode(token) : null;
  const userRole = decodedToken ? decodedToken.role : null;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const profileResponse = await axios.get(
          "http://localhost:3000/peserta/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (profileResponse.data.data) {
          setPesertaData(profileResponse.data.data);
          if (profileResponse.data.data.foto) {
            const photoResponse = await axios.get(
              "http://localhost:3000/peserta/get-foto",
              { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
            );
            setPreview(URL.createObjectURL(photoResponse.data));
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        Swal.fire({ icon: "error", title: "Error", text: "Gagal memuat data profil" });
      }
    };

    fetchInitialData();
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [token]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: "error", title: "File terlalu besar", text: "Ukuran maksimal 5MB" });
      return;
    }
    if (!file.type.includes("image/")) {
      Swal.fire({ icon: "error", title: "Format tidak sesuai", text: "Hanya file gambar yang diperbolehkan" });
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("foto", selectedFile);

    try {
      await axios.put("http://localhost:3000/peserta/update-photo", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      Swal.fire({ icon: "success", title: "Berhasil", text: "Foto profil berhasil diperbarui", timer: 1500, showConfirmButton: false });
      window.location.reload();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Gagal", text: error.response?.data?.error || "Gagal mengupload foto" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 md:ml-[250px]">
        <Navbar user={pesertaData?.nama || "Guest"} />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 lg:p-12 mt-20 max-w-7xl mx-auto"
        >
          <div className="shadow-lg p-6 bg-white dark:bg-gray-800 rounded-2xl bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Profil Peserta</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Silakan unggah foto profil Anda dan pastikan terlihat jelas.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600 flex items-center justify-center border-4 border-blue-600/90 dark:border-blue-400/90 shadow-lg">
                    {preview ? (
                      <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 p-3 bg-blue-600/90 dark:bg-blue-500/90 rounded-full cursor-pointer hover:bg-blue-700/90 dark:hover:bg-blue-600/90 transition-colors shadow-lg">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                    <Pencil className="w-6 h-6 text-white" />
                  </label>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                    className={`px-6 py-2.5 rounded-lg ${
                      selectedFile && !loading
                        ? "bg-blue-600/90 dark:bg-blue-500 text-white hover:bg-blue-700/90 dark:hover:bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    } transition-colors shadow-md`}
                  >
                    {loading ? "Mengupload..." : "Simpan Foto"}
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Informasi Peserta</h2>
                <div className="space-y-4">
                  {pesertaData ? (
                    <>
                      <div className="border-b pb-3 border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nama</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{pesertaData.nama}</p>
                      </div>
                      <div className="border-b pb-3 border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{pesertaData.email}</p>
                      </div>
                      <div className="border-b pb-3 border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400">NIM</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{pesertaData.nim}</p>
                      </div>
                      <div className="border-b pb-3 border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Jurusan</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{pesertaData.jurusan}</p>
                      </div>
                      <div className="border-b pb-3 border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Instansi</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{pesertaData.kelompok?.instansi || "-"}</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600/90 dark:border-blue-400/90"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Profile;