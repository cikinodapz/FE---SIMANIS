import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { Info, Download, AlertCircle } from "lucide-react";
import Input from "../components/Input";
import Select from "../components/Select";
import Swal from "sweetalert2";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, pesertaName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">Generate Sertifikat</h3>
        <p className="text-gray-600 mb-4">
          Apakah Anda yakin ingin men-generate sertifikat untuk peserta{" "}
          {pesertaName}?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

const BiodataModal = ({ isOpen, onClose, biodata }) => {
  const [existingFoto, setExistingFoto] = useState(null);

  useEffect(() => {
    const fetchFoto = async () => {
      if (biodata && biodata.id) {
        // Pastikan ada biodata.id
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(
            `http://localhost:3000/admin/get-foto-peserta/${biodata.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: "blob",
            }
          );

          const fotoUrl = URL.createObjectURL(response.data);
          setExistingFoto(fotoUrl);
        } catch (error) {
          console.error("Error fetching foto:", error);
        }
      }
    };

    fetchFoto();

    return () => {
      if (existingFoto) {
        URL.revokeObjectURL(existingFoto);
      }
    };
  }, [biodata]);

  if (!isOpen || !biodata) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{
        animation: "fadeIn 0.3s ease-out",
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <div
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 w-[95%] max-w-6xl max-h-[85vh] overflow-y-auto shadow-2xl"
        style={{
          animation: "slideIn 0.3s ease-out",
          "@keyframes slideIn": {
            from: { transform: "translateY(-20px)", opacity: 0 },
            to: { transform: "translateY(0)", opacity: 1 },
          },
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Detail Biodata Peserta
            </h3>
            <p className="text-gray-500 mt-1">
              Informasi lengkap peserta magang
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Foto Profil Section */}
        <div className="flex items-center gap-8 mb-8">
          <div className="relative">
            {existingFoto ? (
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-lg">
                  <img
                    src={existingFoto}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI4NSIgcj0iMzUiIGZpbGw9IiMzQjgyRjYiLz48cGF0aCBkPSJNNDAgMTgwQzQwIDE0NCA4MCAxMzAgMTAwIDEzMEMxMjAgMTMwIDE2MCAxNDQgMTYwIDE4MEg0MFoiIGZpbGw9IiMzQjgyRjYiLz48L3N2Zz4=";
                    }}
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-blue-100 shadow-lg">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 shadow-lg">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">{biodata.nama}</h2>
            <div className="mt-1 flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span
                  className={`${
                    !biodata.unit_kerja ? "text-gray-400 italic" : ""
                  }`}
                >
                  {biodata.unit_kerja || "Unit kerja belum ada"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>{biodata.jurusan}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{biodata.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6 flex items-center gap-4">
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              biodata.status_peserta === "Aktif"
                ? "bg-teal-100 text-teal-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            Status: {biodata.status_peserta}
          </span>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              biodata.status_sertifikat === "Selesai"
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            Sertifikat: {biodata.status_sertifikat}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informasi Pribadi */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800">
                Informasi Pribadi
              </h4>
            </div>
            <div className="space-y-3">
              <InfoItem label="Nama" value={biodata.nama} />
              <InfoItem label="Nama Panggilan" value={biodata.nama_penggilan} />
              <InfoItem label="NIM" value={biodata.nim} />
              <InfoItem label="Jurusan" value={biodata.jurusan} />
              <InfoItem label="Email" value={biodata.email} />
              <InfoItem label="Tempat Lahir" value={biodata.tempat_lahir} />
              <InfoItem
                label="Tanggal Lahir"
                value={
                  biodata.tanggal_lahir
                    ? new Date(biodata.tanggal_lahir).toLocaleDateString(
                        "id-ID"
                      )
                    : "-"
                }
              />
              <InfoItem label="Agama" value={biodata.agama} />
              <InfoItem label="No. HP" value={biodata.no_hp} />
              <InfoItem label="IP" value={biodata.ip} />
            </div>
          </div>

          {/* Informasi Keluarga */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800">
                Informasi Keluarga
              </h4>
            </div>
            <div className="space-y-3">
              <InfoItem label="Anak ke-" value={biodata.anak_ke} />
              <InfoItem label="Jumlah Saudara" value={biodata.jumlah_saudara} />
              <InfoItem label="Nama Ayah" value={biodata.nama_ayah} />
              <InfoItem label="Pekerjaan Ayah" value={biodata.pekerjaan_ayah} />
              <InfoItem label="Nama Ibu" value={biodata.nama_ibu} />
              <InfoItem label="Pekerjaan Ibu" value={biodata.pekerjaan_ibu} />
            </div>
          </div>

          {/* Informasi Alamat */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800">
                Informasi Alamat
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <InfoItem
                  label="Alamat"
                  value={biodata.alamat}
                  className="break-words"
                />
              </div>
              <div className="space-y-3">
                <InfoItem
                  label="Alamat Domisili"
                  value={biodata.alamat_domisili}
                  className="break-words"
                />
              </div>
            </div>
          </div>

          {/* Informasi Magang */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-teal-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800">
                Informasi Magang
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <InfoItem label="Unit Kerja" value={biodata.unit_kerja} />
                <InfoItem
                  label="Jadwal Mulai"
                  value={
                    biodata.jadwal_mulai
                      ? new Date(biodata.jadwal_mulai).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"
                  }
                />
                <InfoItem
                  label="Jadwal Selesai"
                  value={
                    biodata.jadwal_selesai
                      ? new Date(biodata.jadwal_selesai).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"
                  }
                />
              </div>
              <div className="space-y-3">
                <InfoItem label="Keahlian" value={biodata.keahlian} />
                <InfoItem
                  label="Alasan Magang"
                  value={biodata.alasan}
                  className="break-words"
                />
              </div>
            </div>
          </div>

          {/* Riwayat Pendidikan */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800">
                Riwayat Pendidikan
              </h4>
            </div>
            {biodata.RiwayatPendidikan &&
            biodata.RiwayatPendidikan.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {biodata.RiwayatPendidikan.map((riwayat, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <h5 className="font-semibold text-indigo-600 mb-2">
                      Pendidikan {index + 1}
                    </h5>
                    <div className="space-y-2">
                      <InfoItem label="Sekolah" value={riwayat.nama_sekolah} />
                      <InfoItem label="Tempat" value={riwayat.tempat} />
                      <InfoItem label="Tahun" value={riwayat.tahun_tempat} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Tidak ada data riwayat pendidikan
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen InfoItem yang diperbarui untuk menangani teks panjang
const InfoItem = ({ label, value, className = "" }) => (
  <div
    className={`flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 ${className}`}
  >
    <span className="text-gray-600 whitespace-nowrap">{label}:</span>
    <span className="font-medium text-gray-800 sm:text-right max-w-[300px] break-words">
      {value || "-"}
    </span>
  </div>
);

const ListPesertaMagang = () => {
  const [daftarPesertaMagang, setDaftarPesertaMagang] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [sortedPesertaMagang, setSortedPesertaMagang] = useState([]);
  const [loading, setLoading] = useState({});
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    pesertaId: null,
    pesertaName: "",
  });

  // Add pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:3000/admin/list-biodata",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.biodatas) {
          setDaftarPesertaMagang(response.data.biodatas);
          setSortedPesertaMagang(response.data.biodatas);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        showAlert("Gagal mengambil data peserta", "error");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleSort(sortOrder);
  }, [sortOrder, daftarPesertaMagang]);

  // Add pagination functions
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Update filtering and pagination logic
  const filteredPesertaMagangPaging = sortedPesertaMagang.filter((peserta) =>
    peserta.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredPesertaMagangPaging.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filteredPesertaMagangPaging.length, itemsPerPage]);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPesertaMagangPaging.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleSort = (order) => {
    const sorted = [...daftarPesertaMagang].sort((a, b) => {
      if (order === "newest")
        return new Date(b.tglDaftar) - new Date(a.tglDaftar);
      if (order === "oldest")
        return new Date(a.tglDaftar) - new Date(b.tglDaftar);
      return 0;
    });
    setSortedPesertaMagang(sorted);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  const handleGenerateSertifikat = async (pesertaId) => {
    try {
      setLoading((prev) => ({ ...prev, [pesertaId]: true }));
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        `http://localhost:3000/admin/generate-sertifikat/${pesertaId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Selamat! 🎉",
        text: "Sertifikat Anda telah berhasil dibuat! 🏆 Terima kasih atas kontribusinya! ⭐",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
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

      // Refresh data setelah generate sertifikat
      const updatedResponse = await axios.get(
        "http://localhost:3000/admin/list-biodata",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (updatedResponse.data.biodatas) {
        setDaftarPesertaMagang(updatedResponse.data.biodatas);
        setSortedPesertaMagang(updatedResponse.data.biodatas);
      }
    } catch (error) {
      console.error("Gagal generate sertifikat:", error);
      // Tampilkan SweetAlert untuk error
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Gagal generate sertifikat",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [pesertaId]: false }));
      setConfirmDialog({ isOpen: false, pesertaId: null, pesertaName: "" });
    }
  };

  const [selectedBiodata, setSelectedBiodata] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openConfirmDialog = (pesertaId, pesertaName) => {
    setConfirmDialog({
      isOpen: true,
      pesertaId,
      pesertaName,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      pesertaId: null,
      pesertaName: "",
    });
  };

  // Tambahkan fungsi download
  const handleDownload = async (pesertaId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:3000/admin/download-sertifikat/${pesertaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Penting untuk menerima file
        }
      );

      // Buat blob URL dan download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `sertifikat-${pesertaId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading sertifikat:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Download",
        text: error.response?.data?.message || "Gagal mendownload sertifikat",
      });
    }
  };

  const filteredPesertaMagang = sortedPesertaMagang.filter((peserta) =>
    peserta.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] mx-auto min-h-screen flex flex-col">
        <Navbar />
        <div className="p-[100px] flex-grow flex flex-col">
          {alert.show && (
            <div
              className={`mb-4 p-4 rounded-lg flex items-center ${
                alert.type === "success"
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : "bg-red-100 border border-red-400 text-red-700"
              }`}
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{alert.message}</span>
            </div>
          )}

          <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            onClose={closeConfirmDialog}
            onConfirm={() => handleGenerateSertifikat(confirmDialog.pesertaId)}
            pesertaName={confirmDialog.pesertaName}
          />

          <div className="shadow-lg p-6 bg-white rounded-md flex flex-col flex-grow">
            <div>
              <h1 className="text-blue-600/90 text-3xl font-bold">
                Daftar Peserta Magang
              </h1>
              <p className="text-sm text-gray-500">Semua Peserta Magang</p>

              <div className="my-4 flex items-center justify-center space-x-4">
                <Input
                  type="text"
                  placeholder="Cari berdasarkan Nama Peserta"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  px={20}
                  className="w-full text-center max-w-lg border border-blue-600/90 rounded-lg"
                />

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-3 border bg-green border-gray-300 text-white font-medium rounded-md"
                >
                  <option value="newest" className="text-black bg-white">
                    Terbaru
                  </option>
                  <option value="oldest" className="text-black bg-white">
                    Terlama
                  </option>
                </select>
              </div>
            </div>

            <table className="w-full border-collapse text-center mt-10">
              <thead>
                <tr className="bg-blue-600/90 text-white border-rounded-lg">
                  <th className="p-2 border border-gray-300">No</th>
                  <th className="p-2 border border-gray-300">Nama Peserta</th>
                  <th className="p-2 border border-gray-300">NIM</th>
                  <th className="p-2 border border-gray-300">Jurusan</th>
                  <th className="p-2 border border-gray-300">Unit Kerja</th>
                  <th className="p-2 border border-gray-300">Detail</th>
                  <th className="p-2 border border-gray-300">Status</th>
                  <th className="p-2 border border-gray-300">Sertifikat</th>
                  <th className="p-2 border border-gray-300">Download</th>{" "}
                  {/* Kolom baru */}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((peserta, index) => (
                  <tr key={index} className="hover:bg-blue-50 text-center">
                    <td className="border border-gray-300 p-2 text-sm">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {peserta.nama}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {peserta.nim}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {peserta.jurusan}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {peserta.unit_kerja}
                    </td>
                    <td className="p-6 border flex items-center justify-center space-x-4">
                      <div
                        className="p-2 rounded-lg bg-white shadow-lg cursor-pointer hover:bg-blue-50 transition-all duration-200"
                        onClick={() => {
                          setSelectedBiodata(peserta);
                          setIsModalOpen(true);
                        }}
                      >
                        <Info className="text-blue-500" />
                      </div>
                    </td>
                    <td className="p-2 border border-gray-300">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          peserta.status_peserta === "Aktif"
                            ? "bg-teal-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {peserta.status_peserta}
                      </span>
                    </td>
                    <td className="p-2 border border-gray-300">
                      {peserta.status_peserta === "Aktif" ? (
                        <button
                          onClick={() =>
                            openConfirmDialog(peserta.id, peserta.nama)
                          }
                          disabled={loading[peserta.id]}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium 
              ${
                loading[peserta.id]
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {loading[peserta.id] ? "Generating..." : "Generate"}
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500">Selesai</span>
                      )}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {peserta.status_sertifikat === "Selesai" && (
                        <button
                          onClick={() => handleDownload(peserta.id)}
                          className="inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold 
        bg-gradient-to-r from-blue-500 to-blue-600 text-white 
        hover:from-blue-600 hover:to-blue-700 
        transform transition-all duration-200 hover:scale-105 
        shadow-md hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                          <Download className="w-4 h-4 mr-2 animate-bounce" />
                          <span></span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="mt-auto pt-4 border-t">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="First page"
                >
                  <ChevronsLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`px-4 py-2 rounded-lg border ${
                            currentPage === pageNumber
                              ? "bg-blue-600/90 text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span key={pageNumber} className="px-2 py-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Last page"
                >
                  <ChevronsRight className="h-5 w-5" />
                </button>

                <span className="text-sm text-gray-600 ml-4">
                  Halaman {currentPage} dari {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Di akhir return, sebelum penutup div terakhir */}
      <BiodataModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBiodata(null);
        }}
        biodata={selectedBiodata}
      />
    </div>
  );
};

export default ListPesertaMagang;
