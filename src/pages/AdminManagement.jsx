import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Popup from "./popUp/Admin";
import { Plus, Trash2, Pencil } from "lucide-react";
import Swal from "sweetalert2";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { DarkModeContext } from "../context/DarkModeContext";

const AdminManagement = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    nip: "",
    jabatan: "",
    role: "Pegawai",
    password: "",
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [editPegawai, setEditPegawai] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Filter pegawai
  const filteredPegawai = pegawaiList.filter((pegawai) =>
    pegawai.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pegawai.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pegawai.nip.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredPegawai.length / itemsPerPage));
    setCurrentPage(1);
  }, [filteredPegawai.length, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPegawai.slice(indexOfFirstItem, indexOfLastItem);

  const fetchPegawaiList = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://web-baru.up.railway.app/admin/list-allakun",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.data) {
        setPegawaiList(response.data.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching pegawai:", error);
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memuat data pegawai",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
    }
  };

  useEffect(() => {
    fetchPegawaiList();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      Swal.fire({
        title: "Memproses...",
        allowOutsideClick: false,
        background: darkMode ? "#1f2937" : "#fff",
        didOpen: () => Swal.showLoading(),
      });

      if (editPegawai) {
        await axios.put(
          `https://web-baru.up.railway.app/admin/edit-akun/${editPegawai.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "https://web-baru.up.railway.app/admin/tambah-akun",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: editPegawai
          ? "Data pegawai berhasil diperbarui"
          : "Pegawai baru berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
      });

      fetchPegawaiList();
      setFormData({ nama: "", email: "", nip: "", jabatan: "", role: "Pegawai", password: "" });
      setIsPopupVisible(false);
      setEditPegawai(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
    }
  };

  const handleEditPegawai = (pegawai) => {
    setEditPegawai(pegawai);
    setFormData({
      nama: pegawai.nama,
      email: pegawai.email,
      nip: pegawai.nip,
      jabatan: pegawai.jabatan,
      role: pegawai.role,
    });
    setIsPopupVisible(true);
  };

  const handleDeletePegawai = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      cancelButtonColor: darkMode ? "#2563eb" : "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      background: darkMode ? "#1f2937" : "#fff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("accessToken");
          await axios.delete(
            `https://web-baru.up.railway.app/admin/hapus-akun/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Data pegawai berhasil dihapus",
            timer: 1500,
            showConfirmButton: false,
            background: darkMode ? "#1f2937" : "#fff",
            confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
          });

          fetchPegawaiList();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: error.response?.data?.message || "Gagal menghapus data",
            background: darkMode ? "#1f2937" : "#fff",
            confirmButtonColor: darkMode ? "#dc2626" : "#d33",
          });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? "border-blue-400" : "border-blue-600"}`}></div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gradient-to-br from-gray-900 to-indigo-900" : "bg-gradient-to-br from-gray-50 to-indigo-50"} transition-colors duration-300`}>
      <Sidebar />
      <div className="flex-1 md:ml-[250px]">
        <Navbar />
        <div className="p-8 lg:p-12 mt-20 max-w-7xl mx-auto">
          <div className={`shadow-lg p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm border transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Daftar Pegawai
                </h1>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Total: {pegawaiList.length} Pegawai
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="Cari pegawai..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-gray-50 border-gray-300 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <Button
                  label="Pegawai"
                  variant="blue"
                  ikon={<Plus className="w-5 h-5" />}
                  onClick={() => setIsPopupVisible(true)}
                  className={`px-4 py-2 ${darkMode ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"} text-white rounded-lg`}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className={`w-full border-collapse ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                <thead>
                  <tr className={`${darkMode ? "bg-blue-600/90" : "bg-blue-600/90"} text-white`}>
                    <th className="p-3 text-left">No</th>
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">NIP</th>
                    <th className="p-3 text-left">Jabatan</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((pegawai, index) => (
                    <tr
                      key={pegawai.id}
                      className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"}`}
                    >
                      <td className="p-3">{indexOfFirstItem + index + 1}</td>
                      <td className="p-3">{pegawai.nama}</td>
                      <td className="p-3">{pegawai.email}</td>
                      <td className="p-3">{pegawai.nip}</td>
                      <td className="p-3">{pegawai.jabatan}</td>
                      <td className="p-3">{pegawai.role}</td>
                      <td className="p-3 flex justify-center gap-2">
                        <button
                          onClick={() => handleEditPegawai(pegawai)}
                          className={`p-2 rounded-lg ${darkMode ? "bg-yellow-900/50 hover:bg-yellow-800/50" : "bg-yellow-50 hover:bg-yellow-100"}`}
                        >
                          <Pencil className={`${darkMode ? "text-yellow-300" : "text-yellow-600"} w-5 h-5`} />
                        </button>
                        <button
                          onClick={() => handleDeletePegawai(pegawai.id)}
                          className={`p-2 rounded-lg ${darkMode ? "bg-red-900/50 hover:bg-red-800/50" : "bg-red-50 hover:bg-red-100"}`}
                        >
                          <Trash2 className={`${darkMode ? "text-red-300" : "text-red-500"} w-5 h-5`} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-center items-center gap-2">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-600"} disabled:opacity-50`}
              >
                <ChevronsLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-600"} disabled:opacity-50`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-600"} disabled:opacity-50`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-600"} disabled:opacity-50`}
              >
                <ChevronsRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Popup Wrapper */}
          {isPopupVisible && (
            <div className={`fixed inset-0 ${darkMode ? "bg-black/70" : "bg-black/50"} flex justify-center items-center z-50`}>
              <div className={`p-6 rounded-lg shadow-lg w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <Popup
                  isVisible={isPopupVisible}
                  onClose={() => {
                    setIsPopupVisible(false);
                    setEditPegawai(null);
                    setFormData({ nama: "", email: "", nip: "", jabatan: "", role: "Pegawai", password: "" });
                  }}
                  onSubmit={handleFormSubmit}
                  formData={formData}
                  onInputChange={handleInputChange}
                  editPegawai={editPegawai}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;