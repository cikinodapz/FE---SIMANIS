import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { Info, Download, AlertCircle } from "lucide-react";
import Input from "../components/Input";
import Select from "../components/Select";
import Swal from "sweetalert2";


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

      // Tampilkan SweetAlert untuk sukses
      Swal.fire({
        title: "Berhasil!",
        text: "Sertifikat berhasil dibuatkan",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
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
    <div className="flex shadow max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] mx-auto h-screen">
        <Navbar />
        <div className="p-[100px]">
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

          <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            <h1 className="text-blue-premier text-3xl font-bold">
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
                className="w-full text-center max-w-lg border border-blue-premier rounded-lg"
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

            <table className="w-full border-collapse text-center mt-10">
              <thead>
                <tr className="bg-blue-premier text-white border-rounded-lg">
                  <th className="p-2 border border-gray-300">No</th>
                  <th className="p-2 border border-gray-300">Nama Peserta</th>
                  <th className="p-2 border border-gray-300">NIM</th>
                  <th className="p-2 border border-gray-300">Jurusan</th>
                  <th className="p-2 border border-gray-300">Detail</th>
                  <th className="p-2 border border-gray-300">Status</th>
                  <th className="p-2 border border-gray-300">Sertifikat</th>
                  <th className="p-2 border border-gray-300">Download</th>{" "}
                  {/* Kolom baru */}
                </tr>
              </thead>
              <tbody>
                {filteredPesertaMagang.map((peserta, index) => (
                  <tr key={index} className="hover:bg-blue-50 text-center">
                    <td className="border border-gray-300 p-2 text-sm">
                      {index + 1}
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
                    <td className="p-6 border flex items-center justify-center space-x-4">
                      <div className="p-2 rounded-lg bg-white shadow-lg">
                        <Info className="text-blue-500 cursor-pointer" />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPesertaMagang;
