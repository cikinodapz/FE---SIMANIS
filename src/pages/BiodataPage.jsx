import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/InputBiodata";
import Button from "../components/Buttonbio";
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
  Camera
} from "lucide-react";

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
      {
        nama_sekolah: "",
        tahun_tempat: "",
        tempat: "",
      },
      {
        nama_sekolah: "",
        tahun_tempat: "",
        tempat: "",
      },
      {
        nama_sekolah: "",
        tahun_tempat: "",
        tempat: "",
      },
    ],
  });

  const [foto, setFoto] = useState(null); // State untuk menyimpan file foto

  const [fotoPreview, setFotoPreview] = useState(null); // Untuk preview foto yang baru diupload
  const [existingFoto, setExistingFoto] = useState(null); // Untuk menampilkan foto yang sudah ada

  useEffect(() => {
    const fetchBiodata = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:3000/peserta/get-biodata",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const biodata = response.data.data;

        if (biodata.foto) {
          // Fetch foto menggunakan axios
          const fotoResponse = await axios.get(
            "http://localhost:3000/peserta/get-foto",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: "blob", // Penting! Untuk menerima data gambar
            }
          );

          // Buat URL dari blob
          const fotoUrl = URL.createObjectURL(fotoResponse.data);
          setExistingFoto(fotoUrl);
        }

        // Update formData dengan data yang diterima
        setFormData((prevData) => ({
          ...prevData,
          nama_penggilan: biodata.nama_penggilan || "",
          tempat_lahir: biodata.tempat_lahir || "",
          tanggal_lahir: biodata.tanggal_lahir
            ? biodata.tanggal_lahir.split("T")[0]
            : "",
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
          jadwal_mulai: biodata.jadwal_mulai
            ? biodata.jadwal_mulai.split("T")[0]
            : "",
          jadwal_selesai: biodata.jadwal_selesai
            ? biodata.jadwal_selesai.split("T")[0]
            : "",
          riwayat_pendidikan:
            biodata.RiwayatPendidikan?.length > 0
              ? [
                  {
                    nama_sekolah:
                      biodata.RiwayatPendidikan[0]?.nama_sekolah || "",
                    tahun_tempat:
                      biodata.RiwayatPendidikan[0]?.tahun_tempat || "",
                    tempat: biodata.RiwayatPendidikan[0]?.tempat || "",
                  },
                  {
                    nama_sekolah:
                      biodata.RiwayatPendidikan[1]?.nama_sekolah || "",
                    tahun_tempat:
                      biodata.RiwayatPendidikan[1]?.tahun_tempat || "",
                    tempat: biodata.RiwayatPendidikan[1]?.tempat || "",
                  },
                  {
                    nama_sekolah:
                      biodata.RiwayatPendidikan[2]?.nama_sekolah || "",
                    tahun_tempat:
                      biodata.RiwayatPendidikan[2]?.tahun_tempat || "",
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
  }, []); // Empty dependency array means this runs once when component mounts

  useEffect(() => {
    // Membersihkan URL preview ketika komponen unmount
    return () => {
      if (fotoPreview) {
        URL.revokeObjectURL(fotoPreview);
      }
    };
  }, [fotoPreview]);

  const [isDataCorrect, setIsDataCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle number fields
    if (name === "anak_ke" || name === "jumlah_saudara") {
      const numValue = value === "" ? "" : parseInt(value);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
      return;
    }

    // Handle float field (IP)
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
      newRiwayat[index] = {
        ...newRiwayat[index],
        [name]: value,
      };
      return {
        ...prev,
        riwayat_pendidikan: newRiwayat,
      };
    });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      // Membuat URL preview untuk foto baru
      const previewUrl = URL.createObjectURL(file);
      setFotoPreview(previewUrl);
    }
  };

  const handleCheckboxChange = (e) => {
    setIsDataCorrect(e.target.checked);
  };

  const validateForm = () => {
    // Add basic validation
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

      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("nama_penggilan", formData.nama_penggilan);
      formDataToSend.append("tempat_lahir", formData.tempat_lahir);
      formDataToSend.append("tanggal_lahir", formData.tanggal_lahir);
      formDataToSend.append(
        "anak_ke",
        formData.anak_ke ? String(formData.anak_ke) : ""
      );
      formDataToSend.append(
        "jumlah_saudara",
        formData.jumlah_saudara ? String(formData.jumlah_saudara) : ""
      );
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
      formDataToSend.append(
        "riwayat_pendidikan",
        JSON.stringify(formData.riwayat_pendidikan)
      );
      if (foto) {
        formDataToSend.append("foto", foto);
      }

      const response = await axios.put(
        "http://localhost:3000/peserta/add-biodata",
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
        customClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        backdrop: `
          rgba(59, 130, 246, 0.1)
          left top
          no-repeat
        `,
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
          text:
            error.response?.data?.message ||
            "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
        });
      }

      setError(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] h-full w-full">
        <Navbar />
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Biodata Peserta
            </h1>
            <p className="text-gray-600 mt-2">
              Lengkapi informasi diri Anda dengan teliti
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
              {error}
            </div>
          )}

           {/* Main Form Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Data Pribadi */}
            <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md border border-gray-200 hover:border-blue-400">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Data Pribadi
                </h2>
              </div>

              {/* Foto Profile Section */}
              <div className="mb-8 border-b border-gray-200 pb-8">
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
                      <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-all duration-200">
                        <label
                          htmlFor="foto-upload"
                          className="cursor-pointer text-gray-400 hover:text-gray-500"
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
                    {/* <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Foto Profil
                    </h3> */}
                    <p className="text-sm text-gray-500 mb-3">
                      Unggah foto profil Anda. Pastikan foto terlihat jelas
                    </p>
                    <label
                      htmlFor="foto-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Pilih Foto
                    </label>
                  </div>
                </div>
              </div>

              {/* Existing Form Fields */}
              <div className="space-y-6">
                <Input
                  name="nama_penggilan"
                  value={formData.nama_penggilan}
                  onChange={handleChange}
                  placeholder="Masukkan nama panggilan"
                  label="Nama Panggilan"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="tempat_lahir"
                    value={formData.tempat_lahir}
                    onChange={handleChange}
                    placeholder="Masukkan tempat lahir"
                    label="Tempat Lahir"
                    required
                  />
                  <Input
                    name="tanggal_lahir"
                    value={formData.tanggal_lahir}
                    onChange={handleChange}
                    type="date"
                    label="Tanggal Lahir"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="anak_ke"
                    value={formData.anak_ke}
                    onChange={handleChange}
                    placeholder="Contoh: 2"
                    label="Anak Ke-"
                    type="number"
                  />
                  <Input
                    name="jumlah_saudara"
                    value={formData.jumlah_saudara}
                    onChange={handleChange}
                    placeholder="Contoh: 3"
                    label="Jumlah Saudara"
                    type="number"
                  />
                </div>
                <Input
                  name="ip"
                  value={formData.ip}
                  onChange={handleChange}
                  placeholder="Contoh: 3.85"
                  label="Indeks Prestasi"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                />
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Agama
                  </label>
                  <select
                    name="agama"
                    value={formData.agama}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
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
                <Input
                  name="no_hp"
                  value={formData.no_hp}
                  onChange={handleChange}
                  placeholder="Masukkan nomor HP"
                  label="Nomor Handphone"
                />
              </div>
            </div>

              {/* Data Alamat dan Informasi */}
              <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md border border-gray-200 hover:border-teal-400">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <Home className="w-6 h-6 text-teal-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Alamat & Informasi
                </h2>
              </div>
              <div className="space-y-6">
                <Input
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan alamat lengkap"
                  label="Alamat"
                />
                <Input
                  name="alamat_domisili"
                  value={formData.alamat_domisili}
                  onChange={handleChange}
                  placeholder="Masukkan alamat domisili"
                  label="Alamat Domisili"
                />
                <Input
                  name="alasan"
                  value={formData.alasan}
                  onChange={handleChange}
                  placeholder="Masukkan alasan magang"
                  label="Alasan Magang"
                />
                <Input
                  name="keahlian"
                  value={formData.keahlian}
                  onChange={handleChange}
                  placeholder="Masukkan keahlian"
                  label="Keahlian"
                />
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Unit Kerja
                  </label>
                  <select
                    name="unit_kerja"
                    value={formData.unit_kerja}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    required
                  >
                    <option value="">Pilih Unit Kerja</option>
                    <option value="Umum">Umum</option>
                    <option value="IT">IT</option>
                    <option value="Diseminasi">Diseminasi</option>
                    <option value="Teknikal">Teknikal</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="jadwal_mulai"
                    value={formData.jadwal_mulai}
                    onChange={handleChange}
                    type="date"
                    label="Jadwal Mulai"
                    required
                  />
                  <Input
                    name="jadwal_selesai"
                    value={formData.jadwal_selesai}
                    onChange={handleChange}
                    type="date"
                    label="Jadwal Selesai"
                    required
                  />
                </div>
              </div>
            </div>

           {/* Data Keluarga */}
           <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md border border-gray-200 hover:border-purple-400">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Data Keluarga
                </h2>
              </div>
              <div className="space-y-6">
                <Input
                  name="nama_ibu"
                  value={formData.nama_ibu}
                  onChange={handleChange}
                  placeholder="Masukkan nama ibu"
                  label="Nama Ibu"
                />
                <Input
                  name="pekerjaan_ibu"
                  value={formData.pekerjaan_ibu}
                  onChange={handleChange}
                  placeholder="Masukkan pekerjaan ibu"
                  label="Pekerjaan Ibu"
                />
                <Input
                  name="nama_ayah"
                  value={formData.nama_ayah}
                  onChange={handleChange}
                  placeholder="Masukkan nama ayah"
                  label="Nama Ayah"
                />
                <Input
                  name="pekerjaan_ayah"
                  value={formData.pekerjaan_ayah}
                  onChange={handleChange}
                  placeholder="Masukkan pekerjaan ayah"
                  label="Pekerjaan Ayah"
                />
              </div>
            </div>

             {/* Riwayat Pendidikan */}
             <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md border border-gray-200 hover:border-yellow-400">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Riwayat Pendidikan
                </h2>
              </div>
              <div className="space-y-8">
                {["SD", "SMP", "SMA/SMK"].map((level, index) => (
                  <div
                    key={level}
                    className="p-4 bg-gray-50 rounded-lg space-y-4 border border-gray-100"
                  
                  >
                    <h3 className="text-lg font-medium text-gray-700">
                      {level}
                    </h3>
                    <Input
                      name="nama_sekolah"
                      value={formData.riwayat_pendidikan[index].nama_sekolah}
                      onChange={(e) => handleRiwayatChange(e, index)}
                      placeholder="Nama Sekolah"
                      label="Nama Sekolah"
                    />
                    <Input
                      name="tahun_tempat"
                      value={formData.riwayat_pendidikan[index].tahun_tempat}
                      onChange={(e) => handleRiwayatChange(e, index)}
                      placeholder="Tahun Lulus"
                      label="Tahun Lulus"
                      type="number"
                    />
                    <Input
                      name="tempat"
                      value={formData.riwayat_pendidikan[index].tempat}
                      onChange={(e) => handleRiwayatChange(e, index)}
                      placeholder="Tempat Sekolah"
                      label="Tempat Sekolah"
                    />
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
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">
                Saya menyatakan bahwa data yang diisi adalah benar.
              </span>
            </label>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!isDataCorrect || loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
