import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import {
  User,
  Users,
  GraduationCap,
  Image,
  Upload,
  Save,
  Loader2,
  Home,
  Camera,
} from "lucide-react";
import { DarkModeContext } from "../context/DarkModeContext";

const BiodataPage = () => {
  const [formData, setFormData] = useState({
    nama_penggilan: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    anak_ke: "",
    jumlah_saudara: "",
    ip: "",
    nama_ibu: "",
    pekerjaan_ibu: "",
    nama_ayah: "",
    pekerjaan_ayah: "",
    agama: "",
    no_hp: "",
    alamat: "",
    alamat_domisili: "",
    alasan: "",
    keahlian: "",
    unit_kerja: "",
    jadwal_mulai: "",
    jadwal_selesai: "",
    riwayat_pendidikan: [
      { nama_sekolah: "", tahun_tempat: "", tempat: "" },
      { nama_sekolah: "", tahun_tempat: "", tempat: "" },
      { nama_sekolah: "", tahun_tempat: "", tempat: "" },
    ],
  });

  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [existingFoto, setExistingFoto] = useState(null);

  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const fetchBiodata = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://web-baru.up.railway.app/peserta/get-biodata",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const biodata = response.data.data;

        if (biodata.foto) {
          const fotoResponse = await axios.get(
            "https://web-baru.up.railway.app/peserta/get-foto",
            { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
          );
          const fotoUrl = URL.createObjectURL(fotoResponse.data);
          setExistingFoto(fotoUrl);
        }

        setFormData((prevData) => ({
          ...prevData,
          nama_penggilan: biodata.nama_penggilan || "",
          tempat_lahir: biodata.tempat_lahir || "",
          tanggal_lahir: biodata.tanggal_lahir ? biodata.tanggal_lahir.split("T")[0] : "",
          anak_ke: biodata.anak_ke || "",
          jumlah_saudara: biodata.jumlah_saudara || "",
          ip: biodata.ip || "",
          nama_ibu: biodata.nama_ibu || "",
          pekerjaan_ibu: biodata.pekerjaan_ibu || "",
          nama_ayah: biodata.nama_ayah || "",
          pekerjaan_ayah: biodata.pekerjaan_ayah || "",
          agama: biodata.agama || "",
          no_hp: biodata.no_hp || "",
          alamat: biodata.alamat || "",
          alamat_domisili: biodata.alamat_domisili || "",
          alasan: biodata.alasan || "",
          keahlian: biodata.keahlian || "",
          unit_kerja: biodata.unit_kerja || "",
          jadwal_mulai: biodata.jadwal_mulai ? biodata.jadwal_mulai.split("T")[0] : "",
          jadwal_selesai: biodata.jadwal_selesai ? biodata.jadwal_selesai.split("T")[0] : "",
          riwayat_pendidikan:
            biodata.RiwayatPendidikan?.length > 0
              ? [
                  {
                    nama_sekolah: biodata.RiwayatPendidikan[0]?.nama_sekolah || "",
                    tahun_tempat: biodata.RiwayatPendidikan[0]?.tahun_tempat || "",
                    tempat: biodata.RiwayatPendidikan[0]?.tempat || "",
                  },
                  {
                    nama_sekolah: biodata.RiwayatPendidikan[1]?.nama_sekolah || "",
                    tahun_tempat: biodata.RiwayatPendidikan[1]?.tahun_tempat || "",
                    tempat: biodata.RiwayatPendidikan[1]?.tempat || "",
                  },
                  {
                    nama_sekolah: biodata.RiwayatPendidikan[2]?.nama_sekolah || "",
                    tahun_tempat: biodata.RiwayatPendidikan[2]?.tahun_tempat || "",
                    tempat: biodata.RiwayatPendidikan[2]?.tempat || "",
                  },
                ]
              : [
                  { nama_sekolah: "", tahun_tempat: "", tempat: "" },
                  { nama_sekolah: "", tahun_tempat: "", tempat: "" },
                  { nama_sekolah: "", tahun_tempat: "", tempat: "" },
                ],
        }));
      } catch (error) {
        console.error("Error fetching biodata:", error);
        if (error.response?.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Sesi Berakhir",
            text: "Silakan login kembali untuk melanjutkan.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal mengambil data",
            text: "Terjadi kesalahan saat mengambil data biodata.",
          });
        }
      }
    };

    fetchBiodata();
  }, []);

  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    };
  }, [fotoPreview]);

  const [isDataCorrect, setIsDataCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "anak_ke" || name === "jumlah_saudara") {
      const numValue = value === "" ? "" : parseInt(value);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
      return;
    }
    if (name === "ip") {
      const floatValue = value === "" ? "" : parseFloat(value);
      setFormData((prev) => ({ ...prev, [name]: floatValue }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRiwayatChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newRiwayat = [...prev.riwayat_pendidikan];
      newRiwayat[index] = { ...newRiwayat[index], [name]: value };
      return { ...prev, riwayat_pendidikan: newRiwayat };
    });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      const previewUrl = URL.createObjectURL(file);
      setFotoPreview(previewUrl);
    }
  };

  const handleCheckboxChange = (e) => {
    setIsDataCorrect(e.target.checked);
  };

  const validateForm = () => {
    if (!formData.nama_penggilan) return "Nama panggilan harus diisi";
    if (!formData.tempat_lahir) return "Tempat lahir harus diisi";
    if (!formData.tanggal_lahir) return "Tanggal lahir harus diisi";
    if (!formData.agama) return "Agama harus diisi";
    if (!formData.unit_kerja) return "Unit kerja harus diisi";
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    const validationError = validateForm();
    if (validationError) {
      Swal.fire({
        icon: "error",
        title: "Validasi Gagal",
        text: validationError,
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const formDataToSend = new FormData();
      formDataToSend.append("nama_penggilan", formData.nama_penggilan);
      formDataToSend.append("tempat_lahir", formData.tempat_lahir);
      formDataToSend.append("tanggal_lahir", formData.tanggal_lahir);
      formDataToSend.append("anak_ke", formData.anak_ke ? String(formData.anak_ke) : "");
      formDataToSend.append("jumlah_saudara", formData.jumlah_saudara ? String(formData.jumlah_saudara) : "");
      formDataToSend.append("ip", formData.ip ? String(formData.ip) : "");
      formDataToSend.append("nama_ibu", formData.nama_ibu);
      formDataToSend.append("pekerjaan_ibu", formData.pekerjaan_ibu);
      formDataToSend.append("nama_ayah", formData.nama_ayah);
      formDataToSend.append("pekerjaan_ayah", formData.pekerjaan_ayah);
      formDataToSend.append("agama", formData.agama);
      formDataToSend.append("no_hp", formData.no_hp);
      formDataToSend.append("alamat", formData.alamat);
      formDataToSend.append("alamat_domisili", formData.alamat_domisili);
      formDataToSend.append("alasan", formData.alasan);
      formDataToSend.append("keahlian", formData.keahlian);
      formDataToSend.append("unit_kerja", formData.unit_kerja);
      formDataToSend.append("jadwal_mulai", formData.jadwal_mulai);
      formDataToSend.append("jadwal_selesai", formData.jadwal_selesai);
      formDataToSend.append("riwayat_pendidikan", JSON.stringify(formData.riwayat_pendidikan));
      if (foto) formDataToSend.append("foto", foto);

      await axios.put(
        "https://web-baru.up.railway.app/peserta/add-biodata",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil Disimpan! 🎉",
        text: "Data biodata Anda telah berhasil disimpan, Semangat Magang nya! 💪✨ Jangan lupa selalu jaga kesehatan! 🌟",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        iconColor: "#3b82f6",
        customClass: { popup: "animate__animated animate__fadeInDown" },
        backdrop: `rgba(59, 130, 246, 0.1) left top no-repeat`,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Sesi Berakhir",
          text: "Silakan login kembali untuk melanjutkan.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: error.response?.data?.message || "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
        });
      }
      setError(error.response?.data?.message || "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 md:ml-[250px]">
        <Navbar />
        <div className="p-8 lg:p-12 mt-20 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
              Biodata Peserta
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Lengkapi informasi diri Anda dengan teliti
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 p-4 mb-6 rounded-r">
              {error}
            </div>
          )}

          {/* Main Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Data Pribadi */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <User className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Data Pribadi
                </h2>
              </div>

              {/* Foto Profile Section */}
              <div className="mb-8 border-b border-gray-200 dark:border-gray-600 pb-8">
                <div className="flex items-center space-x-6">
                  <div className="relative group">
                    {existingFoto || fotoPreview ? (
                      <div className="relative">
                        <img
                          src={fotoPreview || existingFoto}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-full shadow-sm group-hover:shadow-md transition-all duration-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <label
                            htmlFor="foto-upload"
                            className="cursor-pointer text-white"
                          >
                            <Camera className="w-6 h-6" />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-all duration-200">
                        <label
                          htmlFor="foto-upload"
                          className="cursor-pointer text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                        >
                          <Camera className="w-8 h-8" />
                        </label>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleFotoChange}
                      accept="image/*"
                      className="hidden"
                      id="foto-upload"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Unggah foto profil Anda. Pastikan foto terlihat jelas
                    </p>
                    <label
                      htmlFor="foto-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Pilih Foto
                    </label>
                  </div>
                </div>
              </div>

              {/* Existing Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Panggilan
                  </label>
                  <input
                    name="nama_penggilan"
                    value={formData.nama_penggilan}
                    onChange={handleChange}
                    placeholder="Masukkan nama panggilan"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tempat Lahir
                    </label>
                    <input
                      name="tempat_lahir"
                      value={formData.tempat_lahir}
                      onChange={handleChange}
                      placeholder="Masukkan tempat lahir"
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tanggal Lahir
                    </label>
                    <input
                      name="tanggal_lahir"
                      value={formData.tanggal_lahir}
                      onChange={handleChange}
                      type="date"
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Anak Ke-
                    </label>
                    <input
                      name="anak_ke"
                      value={formData.anak_ke}
                      onChange={handleChange}
                      placeholder="Contoh: 2"
                      type="number"
                      className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Jumlah Saudara
                    </label>
                    <input
                      name="jumlah_saudara"
                      value={formData.jumlah_saudara}
                      onChange={handleChange}
                      placeholder="Contoh: 3"
                      type="number"
                      className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Indeks Prestasi
                  </label>
                  <input
                    name="ip"
                    value={formData.ip}
                    onChange={handleChange}
                    placeholder="Contoh: 3.85"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Agama
                  </label>
                  <select
                    name="agama"
                    value={formData.agama}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    required
                  >
                    <option value="">Pilih Agama</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen_Protestan">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Budha">Budha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nomor Handphone
                  </label>
                  <input
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleChange}
                    placeholder="Masukkan nomor HP"
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Data Alamat dan Informasi */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                  <Home className="w-6 h-6 text-teal-500 dark:text-teal-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Alamat & Informasi
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alamat
                  </label>
                  <input
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Masukkan alamat lengkap"
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alamat Domisili
                  </label>
                  <input
                    name="alamat_domisili"
                    value={formData.alamat_domisili}
                    onChange={handleChange}
                    placeholder="Masukkan alamat domisili"
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alasan Magang
                  </label>
                  <input
                    name="alasan"
                    value={formData.alasan}
                    onChange={handleChange}
                    placeholder="Masukkan alasan magang"
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Keahlian
                  </label>
                  <input
                    name="keahlian"
                    value={formData.keahlian}
                    onChange={handleChange}
                    placeholder="Masukkan keahlian"
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Unit Kerja
                  </label>
                  <select
                    name="unit_kerja"
                    value={formData.unit_kerja}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    required
                  >
                    <option value="">Pilih Unit Kerja</option>
                    <option value="Umum">Umum</option>
                    <option value="IT">IT</option>
                    <option value="Diseminasi">Diseminasi</option>
                    <option value="Teknis">Teknis</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Jadwal Mulai
                    </label>
                    <input
                      name="jadwal_mulai"
                      value={formData.jadwal_mulai}
                      onChange={handleChange}
                      type="date"
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Jadwal Selesai
                    </label>
                    <input
                      name="jadwal_selesai"
                      value={formData.jadwal_selesai}
                      onChange={handleChange}
                      type="date"
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Data Keluarga */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Data Keluarga
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Ibu
                  </label>
                  <input
                    name="nama_ibu"
                    value={formData.nama_ibu}
                    onChange={handleChange}
                    placeholder="Masukkan nama ibu"
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pekerjaan Ibu
                  </label>
                  <input
                    name="pekerjaan_ibu"
                    value={formData.pekerjaan_ibu}
                    onChange={handleChange}
                    placeholder="Masukkan pekerjaan ibu"
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Ayah
                  </label>
                  <input
                    name="nama_ayah"
                    value={formData.nama_ayah}
                    onChange={handleChange}
                    placeholder="Masukkan nama ayah"
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pekerjaan Ayah
                  </label>
                  <input
                    name="pekerjaan_ayah"
                    value={formData.pekerjaan_ayah}
                    onChange={handleChange}
                    placeholder="Masukkan pekerjaan ayah"
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Riwayat Pendidikan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-500">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Riwayat Pendidikan
                </h2>
              </div>
              <div className="space-y-8">
                {["SD", "SMP", "SMA/SMK"].map((level, index) => (
                  <div
                    key={level}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4 border border-gray-100 dark:border-gray-600"
                  >
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                      {level}
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nama Sekolah
                      </label>
                      <input
                        name="nama_sekolah"
                        value={formData.riwayat_pendidikan[index].nama_sekolah}
                        onChange={(e) => handleRiwayatChange(e, index)}
                        placeholder="Nama Sekolah"
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tahun Lulus
                      </label>
                      <input
                        name="tahun_tempat"
                        value={formData.riwayat_pendidikan[index].tahun_tempat}
                        onChange={(e) => handleRiwayatChange(e, index)}
                        placeholder="Tahun Lulus"
                        type="number"
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tempat Sekolah
                      </label>
                      <input
                        name="tempat"
                        value={formData.riwayat_pendidikan[index].tempat}
                        onChange={(e) => handleRiwayatChange(e, index)}
                        placeholder="Tempat Sekolah"
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkbox dan Submit */}
          <div className="mt-8 space-y-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={isDataCorrect}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Saya menyatakan bahwa data yang diisi adalah benar.
              </span>
            </label>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!isDataCorrect || loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Simpan Biodata
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiodataPage;