import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/InputBiodata";
import Button from "../components/Buttonbio";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

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
            riwayat_pendidikan: biodata.RiwayatPendidikan?.length > 0
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
  }, []); // Empty dependency array means this runs once when component mounts

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

      // Create the request body matching the backend expectations
      const requestBody = {
        nama_penggilan: formData.nama_penggilan,
        tempat_lahir: formData.tempat_lahir,
        tanggal_lahir: formData.tanggal_lahir,
        anak_ke: formData.anak_ke ? String(formData.anak_ke) : null,
        jumlah_saudara: formData.jumlah_saudara
          ? String(formData.jumlah_saudara)
          : null,
        ip: formData.ip ? String(formData.ip) : null,
        nama_ibu: formData.nama_ibu,
        pekerjaan_ibu: formData.pekerjaan_ibu,
        nama_ayah: formData.nama_ayah,
        pekerjaan_ayah: formData.pekerjaan_ayah,
        agama: formData.agama,
        no_hp: formData.no_hp,
        alamat: formData.alamat,
        alamat_domisili: formData.alamat_domisili,
        alasan: formData.alasan,
        keahlian: formData.keahlian,
        unit_kerja: formData.unit_kerja,
        jadwal_mulai: formData.jadwal_mulai,
        jadwal_selesai: formData.jadwal_selesai,
        riwayat_pendidikan: JSON.stringify([
          {
            nama_sekolah: formData.riwayat_pendidikan[0].nama_sekolah,
            tahun_tempat: formData.riwayat_pendidikan[0].tahun_tempat,
            tempat: formData.riwayat_pendidikan[0].tempat,
          },
          {
            nama_sekolah: formData.riwayat_pendidikan[1].nama_sekolah,
            tahun_tempat: formData.riwayat_pendidikan[1].tahun_tempat,
            tempat: formData.riwayat_pendidikan[1].tempat,
          },
          {
            nama_sekolah: formData.riwayat_pendidikan[2].nama_sekolah,
            tahun_tempat: formData.riwayat_pendidikan[2].tahun_tempat,
            tempat: formData.riwayat_pendidikan[2].tempat,
          },
        ]),
      };

      console.log("Request body:", requestBody); // For debugging

      const response = await axios.put(
        "http://localhost:3000/peserta/add-biodata",
        requestBody,
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
        iconColor: '#3b82f6',
        customClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        backdrop: `
          rgba(59, 130, 246, 0.1)
          left top
          no-repeat
        `
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
    <div className="flex shadow max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] h-full w-full">
        <Navbar />
        <div className="p-[100px]">
          <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            <h1 className="text-blue-premier text-3xl font-bold">
              Formulir Biodata
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              Silahkan lengkapi Biodata
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col space-y-4 max-w-2xl mx-auto">
              <Input
                name="nama_penggilan"
                value={formData.nama_penggilan}
                onChange={handleChange}
                placeholder="Masukkan nama panggilan"
                label="Nama Panggilan"
                required
              />
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <Input
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleChange}
                  placeholder="Masukkan tempat lahir"
                  label="Tempat Lahir"
                  className="flex-1"
                  required
                />
                <Input
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  type="date"
                  label="Tanggal Lahir"
                  className="flex-1"
                  required
                />
              </div>
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <Input
                  name="anak_ke"
                  value={formData.anak_ke}
                  onChange={handleChange}
                  placeholder="Contoh: 2"
                  label="Anak Ke-"
                  type="number"
                  className="flex-1"
                />
                <Input
                  name="jumlah_saudara"
                  value={formData.jumlah_saudara}
                  onChange={handleChange}
                  placeholder="Contoh: 3"
                  label="Jumlah Saudara"
                  type="number"
                  className="flex-1"
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
              <select
                name="agama"
                value={formData.agama}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              <Input
                name="no_hp"
                value={formData.no_hp}
                onChange={handleChange}
                placeholder="Masukkan nomor HP"
                label="Nomor Handphone"
              />
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
              <select
                name="unit_kerja"
                value={formData.unit_kerja}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Pilih Unit Kerja</option>
                <option value="Umum">Umum</option>
                <option value="IT">IT</option>
                <option value="Diseminasi">Diseminasi</option>
                <option value="Teknikal">Teknikal</option>
              </select>
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <Input
                  name="jadwal_mulai"
                  value={formData.jadwal_mulai}
                  onChange={handleChange}
                  type="date"
                  label="Jadwal Mulai"
                  className="flex-1"
                  required
                />
                <Input
                  name="jadwal_selesai"
                  value={formData.jadwal_selesai}
                  onChange={handleChange}
                  type="date"
                  label="Jadwal Selesai"
                  className="flex-1"
                  required
                />
              </div>

              <div className="border p-4 rounded-md space-y-6">
                <h3 className="font-semibold mb-4">Riwayat Pendidikan</h3>
                {/* Riwayat Pendidikan I */}
                <div className="space-y-4 border-b pb-4">
                  <h4 className="font-medium text-gray-700">
                    Riwayat Pendidikan I (SD)
                  </h4>
                  <Input
                    name="nama_sekolah"
                    value={formData.riwayat_pendidikan[0].nama_sekolah}
                    onChange={(e) => handleRiwayatChange(e, 0)}
                    placeholder="Nama Sekolah"
                    label="Nama Sekolah"
                  />
                  <Input
                    name="tahun_tempat"
                    value={formData.riwayat_pendidikan[0].tahun_tempat}
                    onChange={(e) => handleRiwayatChange(e, 0)}
                    placeholder="Tahun Lulus"
                    label="Tahun Lulus"
                    type="number"
                  />
                  <Input
                    name="tempat"
                    value={formData.riwayat_pendidikan[0].tempat}
                    onChange={(e) => handleRiwayatChange(e, 0)}
                    placeholder="Tempat Sekolah"
                    label="Tempat Sekolah"
                  />
                </div>

                {/* Riwayat Pendidikan II */}
                <div className="space-y-4 border-b pb-4">
                  <h4 className="font-medium text-gray-700">
                    Riwayat Pendidikan II (SMP)
                  </h4>
                  <Input
                    name="nama_sekolah"
                    value={formData.riwayat_pendidikan[1].nama_sekolah}
                    onChange={(e) => handleRiwayatChange(e, 1)}
                    placeholder="Nama Sekolah"
                    label="Nama Sekolah"
                  />
                  <Input
                    name="tahun_tempat"
                    value={formData.riwayat_pendidikan[1].tahun_tempat}
                    onChange={(e) => handleRiwayatChange(e, 1)}
                    placeholder="Tahun Lulus"
                    label="Tahun Lulus"
                    type="number"
                  />
                  <Input
                    name="tempat"
                    value={formData.riwayat_pendidikan[1].tempat}
                    onChange={(e) => handleRiwayatChange(e, 1)}
                    placeholder="Tempat Sekolah"
                    label="Tempat Sekolah"
                  />
                </div>

                {/* Riwayat Pendidikan III */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">
                    Riwayat Pendidikan III (SMA/SMK)
                  </h4>
                  <Input
                    name="nama_sekolah"
                    value={formData.riwayat_pendidikan[2].nama_sekolah}
                    onChange={(e) => handleRiwayatChange(e, 2)}
                    placeholder="Nama Sekolah"
                    label="Nama Sekolah"
                  />
                  <Input
                    name="tahun_tempat"
                    value={formData.riwayat_pendidikan[2].tahun_tempat}
                    onChange={(e) => handleRiwayatChange(e, 2)}
                    placeholder="Tahun Lulus"
                    label="Tahun Lulus"
                    type="number"
                  />
                  <Input
                    name="tempat"
                    value={formData.riwayat_pendidikan[2].tempat}
                    onChange={(e) => handleRiwayatChange(e, 2)}
                    placeholder="Tempat Sekolah"
                    label="Tempat Sekolah"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isDataCorrect}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    Saya menyatakan bahwa data yang diisi adalah benar.
                  </span>
                </label>
              </div>

              <div className="text-center mt-6">
                <div className="text-center mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={!isDataCorrect || loading}
                    className="px-8 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20 transition duration-200 hover:bg-blue-700 hover:shadow-blue-500/30 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                  >
                    {loading ? (
                      <span className="inline-flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Menyimpan...
                      </span>
                    ) : (
                      "Simpan"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiodataPage;
