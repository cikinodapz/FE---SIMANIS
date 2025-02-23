import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Camera, Upload, Trash2, User, Pencil } from "lucide-react";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import { DarkModeContext } from "../context/DarkModeContext";

const ProfilePegawai = () => {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pegawaiData, setPegawaiData] = useState(null);

  const { darkMode } = useContext(DarkModeContext);

  const token = localStorage.getItem("accessToken");
  const decodedToken = token ? jwtDecode(token) : null;
  const userRole = decodedToken ? decodedToken.role : null;
  const baseUrl =
    userRole === "Admin" ? "/admin" : userRole === "Pegawai" ? "/pegawai" : "";

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const profileResponse = await axios.get(
          `http://localhost:3000${baseUrl}/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (profileResponse.data.data) {
          setPegawaiData(profileResponse.data.data);

          if (profileResponse.data.data.foto) {
            const photoResponse = await axios.get(
              `http://localhost:3000${baseUrl}/get-foto-pegawai`,
              {
                headers: { Authorization: `Bearer ${token}` },
                responseType: "blob",
              }
            );
            setPreview(URL.createObjectURL(photoResponse.data));
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal memuat data profil",
          background: darkMode ? "#1f2937" : "#fff",
          confirmButtonColor: darkMode ? "#dc2626" : "#d33",
        });
      }
    };

    if (userRole && (userRole === "Admin" || userRole === "Pegawai")) {
      fetchInitialData();
    }
  }, [baseUrl, userRole, darkMode]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File terlalu besar",
        text: "Ukuran maksimal 5MB",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
      return;
    }

    if (!file.type.includes("image/")) {
      Swal.fire({
        icon: "error",
        title: "Format tidak sesuai",
        text: "Hanya file gambar yang diperbolehkan",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
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
      const token = localStorage.getItem("accessToken");
      await axios.put(`http://localhost:3000${baseUrl}/update-photo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Foto profil berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#2563eb" : "rgb(37, 99, 235, 0.9)",
      });

      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.error || "Gagal mengupload foto",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  if (!userRole || (userRole !== "Admin" && userRole !== "Pegawai")) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Access Denied
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 md:ml-[250px]">
        <Navbar user={pegawaiData?.nama} />
        <div className="p-8 lg:p-12 mt-20 max-w-7xl mx-auto">
          <div className="shadow-lg p-6 bg-white dark:bg-gray-800 rounded-2xl bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  Profil {userRole}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pengaturan Foto dan Informasi Profil
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Photo Section */}
              <div className="flex-1 flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="relative mb-6">
                  <div className={`w-48 h-48 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-100'} flex items-center justify-center border-4 ${darkMode ? 'border-blue-500' : 'border-blue-600/90'} shadow-lg`}>
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className={`w-24 h-24 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <label className={`absolute bottom-2 right-2 p-3 ${darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600/90 hover:bg-blue-700/90'} rounded-full cursor-pointer transition-colors shadow-lg`}>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    <Pencil className="w-6 h-6 text-white" />
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                    className={`px-6 py-2.5 rounded-lg ${
                      selectedFile && !loading
                        ? `${darkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600/90 text-white hover:bg-blue-700/90'}`
                        : `${darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500'} cursor-not-allowed`
                    } transition-colors shadow-md`}
                  >
                    {loading ? "Mengupload..." : "Simpan Foto"}
                  </button>
                </div>
              </div>

              {/* Profile Info Section */}
              <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Informasi {userRole}
                </h2>
                <div className="space-y-4">
                  {pegawaiData ? (
                    <>
                      <div className={`border-b pb-3 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nama</p>
                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{pegawaiData.nama}</p>
                      </div>
                      <div className={`border-b pb-3 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>NIP</p>
                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{pegawaiData.nip}</p>
                      </div>
                      <div className={`border-b pb-3 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{pegawaiData.email}</p>
                      </div>
                      <div className={`border-b pb-3 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Jabatan</p>
                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{pegawaiData.jabatan}</p>
                      </div>
                      <div className={`border-b pb-3 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Role</p>
                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{pegawaiData.role}</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center items-center h-40">
                      <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-600/90'}`}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePegawai;