import React, { useState, useEffect, useContext } from "react";
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
  Search,
  Users,
  UserCheck,
  UserMinus,
  Building2,
  FileSearch,
  MonitorIcon,
  Share2Icon,
  WrenchIcon,
  HelpCircle,
  Trash2,
} from "lucide-react";
import { DarkModeContext } from "../context/DarkModeContext";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, pesertaName }) => {
  const { darkMode } = useContext(DarkModeContext);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 ${
        darkMode ? "bg-black/70" : "bg-black/50"
      } flex items-center justify-center z-50`}
    >
      <div
        className={`rounded-lg p-6 max-w-sm w-full mx-4 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-2 ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Generate Sertifikat
        </h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
          Apakah Anda yakin ingin men-generate sertifikat untuk peserta{" "}
          {pesertaName}?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              darkMode
                ? "text-gray-300 bg-gray-700 hover:bg-gray-600"
                : "text-gray-700 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              darkMode
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

const BiodataModal = ({ isOpen, onClose, biodata }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [existingFoto, setExistingFoto] = useState(null);

  useEffect(() => {
    const fetchFoto = async () => {
      if (biodata && biodata.id) {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(
            `https://web-baru.up.railway.app/admin/get-foto-peserta/${biodata.id}`,
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
      className={`fixed inset-0 ${
        darkMode ? "bg-black/70" : "bg-black/50"
      } flex items-center justify-center z-50 p-4`}
    >
      <div
        className={`${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-gradient-to-br from-white to-gray-50 border-gray-100"
        } rounded-2xl p-8 w-[95%] max-w-6xl max-h-[85vh] overflow-y-auto shadow-2xl transition-colors duration-300`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center mb-8 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } border-b pb-4`}
        >
          <div>
            <h3
              className={`text-3xl font-bold ${
                darkMode
                  ? "bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent"
              }`}
            >
              Detail Biodata Peserta
            </h3>
            <p
              className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Informasi lengkap peserta magang
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-all duration-200 ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <svg
              className="w-6 h-6"
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
                <div
                  className={`w-32 h-32 rounded-full overflow-hidden ${
                    darkMode ? "ring-blue-500" : "ring-blue-100"
                  } ring-4 shadow-lg`}
                >
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
                <div
                  className={`absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center`}
                >
                  <span
                    className={`${
                      darkMode ? "text-gray-200" : "text-white"
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  >
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
              <div
                className={`w-32 h-32 rounded-full ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                } flex items-center justify-center ${
                  darkMode ? "ring-blue-500" : "ring-blue-100"
                } ring-4 shadow-lg`}
              >
                <svg
                  className={`w-16 h-16 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
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
            <div
              className={`absolute -bottom-2 -right-2 ${
                darkMode ? "bg-blue-500" : "bg-blue-500"
              } rounded-full p-2 shadow-lg`}
            >
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
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {biodata.nama}
            </h2>
            <div
              className={`mt-1 flex items-center gap-4 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
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
                    !biodata.unit_kerja
                      ? darkMode
                        ? "text-gray-500 italic"
                        : "text-gray-400 italic"
                      : ""
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
                ? darkMode
                  ? "bg-teal-900 text-teal-300"
                  : "bg-teal-100 text-teal-800"
                : darkMode
                ? "bg-red-900 text-red-300"
                : "bg-red-100 text-red-800"
            }`}
          >
            Status: {biodata.status_peserta}
          </span>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              biodata.status_sertifikat === "Selesai"
                ? darkMode
                  ? "bg-blue-900 text-blue-300"
                  : "bg-blue-100 text-blue-800"
                : darkMode
                ? "bg-yellow-900 text-yellow-300"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            Sertifikat: {biodata.status_sertifikat}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informasi Pribadi */}
          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-white"
            } p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
          >
            <div
              className={`flex items-center gap-2 mb-4 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              <div
                className={`p-2 ${
                  darkMode ? "bg-blue-900" : "bg-blue-100"
                } rounded-lg`}
              >
                <svg
                  className={`w-5 h-5 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
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
              <h4 className="text-xl font-semibold">Informasi Pribadi</h4>
            </div>
            <div className="space-y-3">
              <InfoItem label="Nama" value={biodata.nama} />
              <InfoItem label="Nama Panggilan" value={biodata.nama_penggilan} />
              <InfoItem label="NIM / NISN" value={biodata.nim} />
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
          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-white"
            } p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
          >
            <div
              className={`flex items-center gap-2 mb-4 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              <div
                className={`p-2 ${
                  darkMode ? "bg-purple-900" : "bg-purple-100"
                } rounded-lg`}
              >
                <svg
                  className={`w-5 h-5 ${
                    darkMode ? "text-purple-400" : "text-purple-600"
                  }`}
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
              <h4 className="text-xl font-semibold">Informasi Keluarga</h4>
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
          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-white"
            } p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 mt-6`}
          >
            <div
              className={`flex items-center gap-2 mb-4 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              <div
                className={`p-2 ${
                  darkMode ? "bg-orange-900" : "bg-orange-100"
                } rounded-lg`}
              >
                <svg
                  className={`w-5 h-5 ${
                    darkMode ? "text-orange-400" : "text-orange-600"
                  }`}
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
              <h4 className="text-xl font-semibold">Informasi Alamat</h4>
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
          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-white"
            } p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2`}
          >
            <div
              className={`flex items-center gap-2 mb-4 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              <div
                className={`p-2 ${
                  darkMode ? "bg-teal-900" : "bg-teal-100"
                } rounded-lg`}
              >
                <svg
                  className={`w-5 h-5 ${
                    darkMode ? "text-teal-400" : "text-teal-600"
                  }`}
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
              <h4 className="text-xl font-semibold">Informasi Magang</h4>
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
          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-white"
            } p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2`}
          >
            <div
              className={`flex items-center gap-2 mb-4 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              <div
                className={`p-2 ${
                  darkMode ? "bg-blue-900" : "bg-blue-100"
                } rounded-lg`}
              >
                <svg
                  className={`w-5 h-5 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
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
              <h4 className="text-xl font-semibold">Riwayat Pendidikan</h4>
            </div>
            {biodata.RiwayatPendidikan &&
            biodata.RiwayatPendidikan.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {biodata.RiwayatPendidikan.map((riwayat, index) => (
                  <div
                    key={index}
                    className={`${
                      darkMode ? "bg-gray-600" : "bg-gray-50"
                    } p-4 rounded-lg ${
                      darkMode ? "hover:bg-gray-500" : "hover:bg-gray-100"
                    } transition-colors duration-200`}
                  >
                    <h5
                      className={`font-semibold ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      } mb-2`}
                    >
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
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } italic`}
              >
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
const InfoItem = ({ label, value, className = "" }) => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 ${className}`}
    >
      <span
        className={`${
          darkMode ? "text-gray-400" : "text-gray-600"
        } whitespace-nowrap`}
      >
        {label}:
      </span>
      <span
        className={`font-medium ${
          darkMode ? "text-gray-200" : "text-gray-800"
        } sm:text-right max-w-[300px] break-words`}
      >
        {value || "-"}
      </span>
    </div>
  );
};

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, pesertaName }) => {
  const { darkMode } = useContext(DarkModeContext);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 ${
        darkMode ? "bg-black/70" : "bg-black/50"
      } flex items-center justify-center z-50`}
    >
      <div
        className={`rounded-lg p-6 max-w-sm w-full mx-4 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-center mb-4">
          <div
            className={`p-3 rounded-full ${
              darkMode ? "bg-red-900" : "bg-red-100"
            }`}
          >
            <AlertCircle
              className={`w-8 h-8 ${
                darkMode ? "text-red-300" : "text-red-600"
              }`}
            />
          </div>
        </div>
        <h3
          className={`text-lg font-semibold text-center mb-2 ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Hapus Peserta
        </h3>
        <p
          className={`text-center mb-6 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Apakah Anda yakin ingin menghapus peserta{" "}
          <span className="font-semibold">{pesertaName}</span>? Tindakan ini
          tidak dapat dibatalkan.
        </p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              darkMode
                ? "text-gray-300 bg-gray-700 hover:bg-gray-600"
                : "text-gray-700 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              darkMode
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

// Add the new LoadingScreen component for certificate generation
const LoadingScreen = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`fixed inset-0 ${
        darkMode ? "bg-black/70" : "bg-black/50"
      } flex items-center justify-center z-50`}
    >
      <div
        className={`p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm mx-4 relative overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-1 ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          <div
            className={`loading-bar h-full ${
              darkMode ? "bg-blue-500" : "bg-blue-600"
            }`}
          ></div>
        </div>

        <div className="w-20 h-20 mb-4 relative">
          <div
            className={`spin-slow absolute inset-0 border-4 ${
              darkMode ? "border-blue-700" : "border-blue-200"
            } rounded-full`}
          ></div>
          <div
            className={`spin-fast absolute inset-0 border-4 ${
              darkMode ? "border-blue-500" : "border-blue-600"
            } rounded-full border-t-transparent`}
          ></div>
          <div className="absolute inset-2 flex items-center justify-center">
            <Download
              className={`w-10 h-10 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              } pulse-icon`}
            />
          </div>
        </div>

        <h3
          className={`text-xl font-bold mb-2 pulse-text ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Generating Sertifikat
        </h3>
        <p
          className={`text-center mb-4 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Mohon tunggu sebentar, sistem sedang membuat sertifikat Anda...
        </p>

        <div className="flex gap-1">
          <div
            className={`loading-dot w-2 h-2 ${
              darkMode ? "bg-blue-500" : "bg-blue-600"
            } rounded-full`}
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className={`loading-dot w-2 h-2 ${
              darkMode ? "bg-blue-500" : "bg-blue-600"
            } rounded-full`}
            style={{ animationDelay: "200ms" }}
          ></div>
          <div
            className={`loading-dot w-2 h-2 ${
              darkMode ? "bg-blue-500" : "bg-blue-600"
            } rounded-full`}
            style={{ animationDelay: "400ms" }}
          ></div>
        </div>

        <style jsx>{`
          @keyframes loading {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(0.95);
            }
          }

          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          .loading-bar {
            animation: loading 2s ease-in-out infinite;
          }

          .spin-slow {
            animation: spin 3s linear infinite;
          }

          .spin-fast {
            animation: spin 1.5s linear infinite;
          }

          .pulse-icon {
            animation: pulse 2s ease-in-out infinite;
          }

          .pulse-text {
            animation: pulse 1.5s ease-in-out infinite;
          }

          .loading-dot {
            animation: bounce 1s infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

const ListPesertaMagang = () => {
  const { darkMode } = useContext(DarkModeContext);
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [statusFilter, setStatusFilter] = useState("");
  const [unitKerjaFilter, setUnitKerjaFilter] = useState("");
  const [divisiStats, setDivisiStats] = useState([]);

  const getDivisiCount = (divisi) => {
    return (
      divisiStats.find(
        (stat) =>
          stat.unit_kerja === divisi &&
          (!statusFilter || stat.status_peserta === statusFilter)
      )?._count?.id || 0
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        let url = "https://web-baru.up.railway.app/admin/list-biodata";
        const params = new URLSearchParams();
        if (statusFilter) params.append("status_peserta", statusFilter);
        if (unitKerjaFilter) params.append("unit_kerja", unitKerjaFilter);

        const finalUrl = `${url}?${params.toString()}`;

        const response = await axios.get(finalUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.biodatas) {
          setDaftarPesertaMagang(response.data.biodatas);
          setSortedPesertaMagang(response.data.biodatas);
        }
        if (response.data.divisiStats) {
          setDivisiStats(response.data.divisiStats);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        showAlert("Gagal mengambil data peserta", "error");
      }
    };

    fetchData();
  }, [statusFilter, unitKerjaFilter]);

  useEffect(() => {
    handleSort(sortOrder);
  }, [sortOrder, daftarPesertaMagang]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const filteredPesertaMagangPaging = sortedPesertaMagang.filter((peserta) =>
    peserta.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredPesertaMagangPaging.length / itemsPerPage));
    setCurrentPage(1);
  }, [filteredPesertaMagangPaging.length, itemsPerPage]);

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

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSertifikat = async (pesertaId) => {
    try {
      setIsGenerating(true);
      setLoading((prev) => ({ ...prev, [pesertaId]: true }));
      const token = localStorage.getItem("accessToken");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await axios.post(
        `https://web-baru.up.railway.app/admin/generate-sertifikat/${pesertaId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 500));

      await Swal.fire({
        icon: "success",
        title: "Sertifikat Berhasil Dibuat! 🎉",
        html: `
          <div class="space-y-4">
            <div class="flex items-center justify-center">
              <svg class="w-16 h-16 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-gray-${
              darkMode ? "400" : "600"
            }">Selamat! Sertifikat telah berhasil dibuat.</p>
            <div class="text-sm text-blue-${darkMode ? "400" : "600"} mt-2">
              Dokumen ini mencatat pencapaian dan kerja keras selama program magang.
            </div>
          </div>
        `,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: "Selesai",
        confirmButtonColor: darkMode ? "#2563eb" : "#3b82f6",
        background: darkMode ? "#1f2937" : "#fff",
        customClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        backdrop: `
          rgba(59, 130, 246, 0.1)
          left top
          no-repeat
        `,
      });

      const updatedResponse = await axios.get(
        "https://web-baru.up.railway.app/admin/list-biodata",
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
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Gagal generate sertifikat",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
        background: darkMode ? "#1f2937" : "#fff",
      });
    } finally {
      setIsGenerating(false);
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

  const [isDownloading, setIsDownloading] = useState(false);

  const DownloadLoadingScreen = () => (
    <div
      className={`fixed inset-0 ${
        darkMode ? "bg-black/70" : "bg-black/50"
      } flex items-center justify-center z-50`}
    >
      <div
        className={`p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm mx-4 relative overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-1 ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          <div
            className={`loading-bar h-full ${
              darkMode ? "bg-blue-500" : "bg-blue-600"
            }`}
          ></div>
        </div>

        <div className="w-20 h-20 mb-4 relative">
          <div
            className={`spin-slow absolute inset-0 border-4 ${
              darkMode ? "border-blue-700" : "border-blue-200"
            } rounded-full`}
          ></div>
          <div
            className={`spin-fast absolute inset-0 border-4 ${
              darkMode ? "border-blue-500" : "border-blue-600"
            } rounded-full border-t-transparent`}
          ></div>
          <div className="absolute inset-2 flex items-center justify-center">
            <Download
              className={`w-10 h-10 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              } pulse-icon`}
            />
          </div>
        </div>

        <h3
          className={`text-xl font-bold mb-2 pulse-text ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Downloading Sertifikat
        </h3>
        <p
          className={`text-center mb-4 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Mohon tunggu sebentar, sistem sedang memproses download sertifikat
          Anda...
        </p>

        <div className="flex gap-1">
          <div
            className={`loading-dot w-2 h-2 ${
              darkMode ? "bg-blue-500" : "bg-blue-600"
            } rounded-full`}
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className={`loading-dot w-2 h-2 ${
              darkMode ? "bg-blue-500" : "bg-blue-600"
            } rounded-full`}
            style={{ animationDelay: "200ms" }}
          ></div>
          <div
            className={`loading-dot w-2 h-2 ${
              darkMode ? "bg-blue-500" : "bg-blue-600"
            } rounded-full`}
            style={{ animationDelay: "400ms" }}
          ></div>
        </div>

        <style jsx>{`
          @keyframes loading {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(0.95);
            }
          }

          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          .loading-bar {
            animation: loading 2s ease-in-out infinite;
          }

          .spin-slow {
            animation: spin 3s linear infinite;
          }

          .spin-fast {
            animation: spin 1.5s linear infinite;
          }

          .pulse-icon {
            animation: pulse 2s ease-in-out infinite;
          }

          .pulse-text {
            animation: pulse 1.5s ease-in-out infinite;
          }

          .loading-dot {
            animation: bounce 1s infinite;
          }
        `}</style>
      </div>
    </div>
  );

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    pesertaId: null,
    pesertaName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteDialog = (pesertaId, pesertaName) => {
    setDeleteDialog({
      isOpen: true,
      pesertaId,
      pesertaName,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      pesertaId: null,
      pesertaName: "",
    });
  };

  const handleDeletePeserta = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("accessToken");

      await axios.delete(
        `https://web-baru.up.railway.app/admin/delete-peserta/${deleteDialog.pesertaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Berhasil Menghapus Peserta",
        text: "Data peserta telah dihapus secara permanen",
        timer: 2000,
        showConfirmButton: false,
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
      });

      const response = await axios.get(
        "https://web-baru.up.railway.app/admin/list-biodata",
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
      console.error("Gagal menghapus peserta:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus Peserta",
        text:
          error.response?.data?.error ||
          "Terjadi kesalahan saat menghapus peserta",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
    } finally {
      setIsDeleting(false);
      closeDeleteDialog();
    }
  };

  const DeleteLoadingScreen = () => (
    <div
      className={`fixed inset-0 ${
        darkMode ? "bg-black/70" : "bg-black/50"
      } flex items-center justify-center z-50`}
    >
      <div
        className={`p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm mx-4 relative overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-1 ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          <div
            className={`loading-bar h-full ${
              darkMode ? "bg-red-500" : "bg-red-600"
            }`}
          ></div>
        </div>

        <div className="w-20 h-20 mb-4 relative">
          <div
            className={`spin-slow absolute inset-0 border-4 ${
              darkMode ? "border-red-700" : "border-red-200"
            } rounded-full`}
          ></div>
          <div
            className={`spin-fast absolute inset-0 border-4 ${
              darkMode ? "border-red-500" : "border-red-600"
            } rounded-full border-t-transparent`}
          ></div>
          <div className="absolute inset-2 flex items-center justify-center">
            <AlertCircle
              className={`w-10 h-10 ${
                darkMode ? "text-red-400" : "text-red-600"
              } pulse-icon`}
            />
          </div>
        </div>

        <h3
          className={`text-xl font-bold mb-2 pulse-text ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Menghapus Peserta
        </h3>
        <p
          className={`text-center mb-4 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Mohon tunggu sebentar, sistem sedang menghapus data peserta...
        </p>

        <div className="flex gap-1">
          <div
            className={`loading-dot w-2 h-2 ${
              darkMode ? "bg-red-500" : "bg-red-600"
            } rounded-full`}
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className={`loading-dot w-2 h-2 ${
              darkMode ? "bg-red-500" : "bg-red-600"
            } rounded-full`}
            style={{ animationDelay: "200ms" }}
          ></div>
          <div
            className={`loading-dot w-2 h-2 ${
              darkMode ? "bg-red-500" : "bg-red-600"
            } rounded-full`}
            style={{ animationDelay: "400ms" }}
          ></div>
        </div>

        <style jsx>{`
          @keyframes loading {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(0.95);
            }
          }

          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          .loading-bar {
            animation: loading 2s ease-in-out infinite;
          }

          .spin-slow {
            animation: spin 3s linear infinite;
          }

          .spin-fast {
            animation: spin 1.5s linear infinite;
          }

          .pulse-icon {
            animation: pulse 2s ease-in-out infinite;
          }

          .pulse-text {
            animation: pulse 1.5s ease-in-out infinite;
          }

          .loading-dot {
            animation: bounce 1s infinite;
          }
        `}</style>
      </div>
    </div>
  );

  const handleDownload = async (pesertaId) => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem("accessToken");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await axios.get(
        `https://web-baru.up.railway.app/admin/download-sertifikat/${pesertaId}`,
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
      link.setAttribute("download", `sertifikat-${pesertaId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      await Swal.fire({
        icon: "success",
        title: "Download Berhasil! 🎉",
        text: "Sertifikat telah berhasil diunduh",
        timer: 2000,
        showConfirmButton: false,
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
      });
    } catch (error) {
      console.error("Error downloading sertifikat:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Download",
        text: error.response?.data?.message || "Gagal mendownload sertifikat",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className={`flex min-h-screen ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-indigo-900"
          : "bg-gradient-to-br from-gray-50 to-indigo-50"
      } transition-colors duration-300`}
    >
      <Sidebar />
      <div className="flex-1 md:ml-[250px]">
        <Navbar />
        <div className="p-8 lg:p-12 mt-20 max-w-7xl mx-auto">
          {alert.show && (
            <div
              className={`mb-4 p-4 rounded-lg flex items-center ${
                alert.type === "success"
                  ? darkMode
                    ? "bg-teal-900 border-teal-700 text-teal-300"
                    : "bg-teal-100 border-teal-400 text-teal-700"
                  : darkMode
                  ? "bg-red-900 border-red-700 text-red-300"
                  : "bg-red-100 border-red-400 text-red-700"
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

          <div
            className={`shadow-lg p-8 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            } rounded-xl flex flex-col flex-grow`}
          >
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1
                    className={`text-3xl font-bold ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    Daftar Peserta Magang
                  </h1>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    } mt-1`}
                  >
                    Kelola data peserta magang
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-8">
                <Input
                  type="text"
                  placeholder="Cari berdasarkan Nama Peserta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full text-center max-w-2xl mx-auto block shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              {/* Filters Container */}
              <div
                className={`${
                  darkMode ? "bg-blue-700" : "bg-blue-300"
                } p-6 rounded-xl mb-6`}
              >
                <div className="space-y-6">
                  {/* Status Filters */}
                  <div>
                    <div className="flex flex-col items-center">
                      <h3
                        className={`text-sm font-medium mb-3 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Status Peserta
                      </h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setStatusFilter("")}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                            statusFilter === ""
                              ? darkMode
                                ? "bg-blue-500 text-white shadow-md"
                                : "bg-blue-600 text-white shadow-md"
                              : darkMode
                              ? "bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500"
                              : "bg-white text-gray-600 hover:bg-blue-300 border-gray-200"
                          }`}
                        >
                          <Users className="w-4 h-4" />
                          <span>Semua</span>
                        </button>
                        <button
                          onClick={() => setStatusFilter("Aktif")}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                            statusFilter === "Aktif"
                              ? darkMode
                                ? "bg-teal-500 text-white shadow-md"
                                : "bg-teal-600 text-white shadow-md"
                              : darkMode
                              ? "bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500"
                              : "bg-white text-gray-600 hover:bg-blue-300 border-gray-200"
                          }`}
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Aktif</span>
                        </button>
                        <button
                          onClick={() => setStatusFilter("Nonaktif")}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                            statusFilter === "Nonaktif"
                              ? darkMode
                                ? "bg-red-500 text-white shadow-md"
                                : "bg-red-600 text-white shadow-md"
                              : darkMode
                              ? "bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500"
                              : "bg-white text-gray-600 hover:bg-blue-300 border-gray-200"
                          }`}
                        >
                          <UserMinus className="w-4 h-4" />
                          <span>Nonaktif</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unit Kerja Filters */}
                  <div className="flex flex-col items-center">
                    <h3
                      className={`text-sm font-medium mb-3 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Unit Kerja
                    </h3>
                    <div className="flex justify-center flex-wrap gap-3">
                      <button
                        onClick={() => setUnitKerjaFilter("")}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          unitKerjaFilter === ""
                            ? darkMode
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-blue-600 text-white shadow-md"
                            : darkMode
                            ? "bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500"
                            : "bg-white text-gray-600 hover:bg-blue-300 border-gray-200"
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Semua</span>
                      </button>

                      <button
                        onClick={() => setUnitKerjaFilter("Umum")}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          unitKerjaFilter === "Umum"
                            ? darkMode
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-blue-600 text-white shadow-md"
                            : darkMode
                            ? "bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500"
                            : "bg-white text-gray-600 hover:bg-blue-300 border-gray-200"
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        <span>Umum</span>
                      </button>

                      <button
                        onClick={() => setUnitKerjaFilter("IT")}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          unitKerjaFilter === "IT"
                            ? darkMode
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-blue-600 text-white shadow-md"
                            : darkMode
                            ? "bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500"
                            : "bg-white text-gray-600 hover:bg-blue-300 border-gray-200"
                        }`}
                      >
                        <MonitorIcon className="w-4 h-4" />
                        <span>IT</span>
                      </button>

                      <button
                        onClick={() => setUnitKerjaFilter("Diseminasi")}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          unitKerjaFilter === "Diseminasi"
                            ? darkMode
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-blue-600 text-white shadow-md"
                            : darkMode
                            ? "bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500"
                            : "bg-white text-gray-600 hover:bg-blue-300 border-gray-200"
                        }`}
                      >
                        <Share2Icon className="w-4 h-4" />
                        <span>Diseminasi</span>
                      </button>

                      <button
                        onClick={() => setUnitKerjaFilter("Teknis")}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          unitKerjaFilter === "Teknis"
                            ? darkMode
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-blue-600 text-white shadow-md"
                            : darkMode
                            ? "bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500"
                            : "bg-white text-gray-600 hover:bg-blue-300 border-gray-200"
                        }`}
                      >
                        <WrenchIcon className="w-4 h-4" />
                        <span>Teknis</span>
                      </button>

                      <button
                        onClick={() => setUnitKerjaFilter("Tidak Ditentukan")}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          unitKerjaFilter === "Tidak Ditentukan"
                            ? darkMode
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-blue-600 text-white shadow-md"
                            : darkMode
                            ? "bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500"
                            : "bg-white text-gray-600 hover:bg-blue-300 border-gray-200"
                        }`}
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>Tidak Ditentukan</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center mt-4">
                <div
                  className={`${
                    darkMode
                      ? "bg-gradient-to-r from-gray-700 to-gray-700 border-gray-600"
                      : "bg-gradient-to-r from-blue-50 to-blue-50 border-blue-100"
                  } border shadow-sm px-8 py-3 rounded-xl flex items-center gap-3`}
                >
                  <div
                    className={`p-2 ${
                      darkMode ? "bg-blue-900" : "bg-blue-500/10"
                    } rounded-lg`}
                  >
                    <FileSearch
                      className={`w-5 h-5 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span className="font-medium">Menampilkan</span>
                    <span
                      className={`px-3 py-1 ${
                        darkMode ? "bg-gray-600" : "bg-white"
                      } rounded-lg font-bold ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      } shadow-sm`}
                    >
                      {currentItems.length}
                    </span>
                    <span className="font-medium">dari</span>
                    <span
                      className={`px-3 py-1 ${
                        darkMode ? "bg-gray-600" : "bg-white"
                      } rounded-lg font-bold ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      } shadow-sm`}
                    >
                      {filteredPesertaMagangPaging.length}
                    </span>
                    <span className="font-medium">peserta</span>
                    {statusFilter && (
                      <span className="flex items-center gap-1">
                        <span>dengan status</span>
                        <span
                          className={`px-3 py-1 rounded-lg font-semibold ${
                            statusFilter === "Aktif"
                              ? darkMode
                                ? "bg-teal-900 text-teal-300"
                                : "bg-teal-100 text-teal-700"
                              : darkMode
                              ? "bg-red-900 text-red-300"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {statusFilter}
                        </span>
                      </span>
                    )}
                    {unitKerjaFilter && (
                      <span className="flex items-center gap-1">
                        <span>di divisi</span>
                        <span
                          className={`px-3 py-1 ${
                            darkMode ? "bg-blue-900" : "bg-blue-100"
                          } ${
                            darkMode ? "text-blue-300" : "text-blue-700"
                          } rounded-lg font-semibold`}
                        >
                          {unitKerjaFilter}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <table
              className={`w-full border-collapse text-center ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              <thead>
                <tr
                  className={`${
                    darkMode ? "bg-blue-600/90" : "bg-blue-600/90"
                  } text-white`}
                >
                  <th className="p-2">No</th>
                  <th className="p-2">Nama Peserta</th>
                  <th className="p-2">NIM / NISN</th>
                  <th className="p-2">Jurusan</th>
                  <th className="p-2">Unit Kerja</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Sertifikat</th>
                  <th className="p-2">Download</th>
                  <th className="p-2">Detail</th>
                  <th className="p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((peserta, index) => (
                  <tr
                    key={index}
                    className={`${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"
                    }`}
                  >
                    <td className="p-2 text-sm">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="p-2">{peserta.nama}</td>
                    <td className="p-2">{peserta.nim}</td>
                    <td className="p-2">{peserta.jurusan}</td>
                    <td className="p-2">
                      {peserta.unit_kerja || "Tidak Ditentukan"}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          peserta.status_peserta === "Aktif"
                            ? darkMode
                              ? "bg-teal-900 text-teal-300"
                              : "bg-teal-100 text-teal-800"
                            : darkMode
                            ? "bg-red-900 text-red-300"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {peserta.status_peserta}
                      </span>
                    </td>
                    <td className="p-2">
                      {peserta.status_peserta === "Aktif" ? (
                        <button
                          onClick={() =>
                            openConfirmDialog(peserta.id, peserta.nama)
                          }
                          disabled={loading[peserta.id]}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                            loading[peserta.id]
                              ? darkMode
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : darkMode
                              ? "bg-blue-900 text-blue-300 hover:bg-blue-800"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {loading[peserta.id] ? "Generating..." : "Generate"}
                        </button>
                      ) : (
                        <span
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Selesai
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      {peserta.status_sertifikat === "Selesai" && (
                        <button
                          onClick={() => handleDownload(peserta.id)}
                          className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold text-white transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                            darkMode
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-400"
                              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500"
                          }`}
                        >
                          <Download className="w-4 h-4 mr-2 animate-bounce" />
                          <span></span>
                        </button>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-center space-x-4">
                        <div
                          className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            darkMode
                              ? "bg-blue-900 hover:bg-blue-800"
                              : "bg-blue-100 hover:bg-blue-50"
                          }`}
                          onClick={() => {
                            setSelectedBiodata(peserta);
                            setIsModalOpen(true);
                          }}
                        >
                          <Info
                            className={`${
                              darkMode ? "text-blue-300" : "text-blue-500"
                            }`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() =>
                          openDeleteDialog(peserta.id, peserta.nama)
                        }
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                          darkMode
                            ? "bg-red-900 text-red-300 hover:bg-red-800"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        <Trash2 className="w-6 h-6 mr-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div
              className={`mt-auto pt-4 ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } border-t`}
            >
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label="First page"
                >
                  <ChevronsLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                              ? darkMode
                                ? "bg-blue-600 text-white"
                                : "bg-blue-600/90 text-white"
                              : darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
                              : "hover:bg-gray-100 text-gray-600 border-gray-300"
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
                        <span
                          key={pageNumber}
                          className={`px-2 py-1 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
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
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label="Last page"
                >
                  <ChevronsRight className="h-5 w-5" />
                </button>

                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } ml-4`}
                >
                  Halaman {currentPage} dari {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>

        <BiodataModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBiodata(null);
          }}
          biodata={selectedBiodata}
        />
        {isGenerating && <LoadingScreen />}
        {isDownloading && <DownloadLoadingScreen />}
        <DeleteConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDeletePeserta}
          pesertaName={deleteDialog.pesertaName}
        />
        {isDeleting && <DeleteLoadingScreen />}
      </div>
    </div>
  );
};

export default ListPesertaMagang;
