import React, { useState, useEffect, useContext } from "react"; // Tambah useContext
import Input from "../components/Input";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DeletedAlert from "../components/DeletedAlert";
import axios from "axios";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { DarkModeContext } from "../context/DarkModeContext"; // Import DarkModeContext

const Modal = ({ children, isOpen, onClose, darkMode }) => { // Tambah prop darkMode
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg shadow-lg max-w-lg w-full relative ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

const FormTugas = () => {
  const [deskripsiTugas, setDeskripsiTugas] = useState("");
  const [deadline, setDeadline] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editTugasId, setEditTugasId] = useState(null);
  const [rekapanTugas, setRekapanTugas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pesertaList, setPesertaList] = useState([]);
  const [selectedPesertaId, setSelectedPesertaId] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  // Tambah DarkModeContext
  const { darkMode } = useContext(DarkModeContext);

  // Pagination functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Filter and sort tugas
  const filteredTugasPaging = rekapanTugas
    .filter((tugas) =>
      tugas.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const namaA = a.peserta?.nama || '';
      const namaB = b.peserta?.nama || '';
      return namaA.localeCompare(namaB);
    });

  // Update total pages when filtered data changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredTugasPaging.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filteredTugasPaging.length, itemsPerPage]);

  // Get current items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTugasPaging.slice(indexOfFirstItem, indexOfLastItem);

  const fetchPesertaList = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://web-baru.up.railway.app/pegawai/list-peserta",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.biodatas) {
        setPesertaList(response.data.biodatas);
      }
    } catch (error) {
      console.error("Error fetching peserta:", error);
    }
  };

  const fetchTugas = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://web-baru.up.railway.app/pegawai/list-tugas",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setRekapanTugas(response.data.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tugas:", error);
      setError("Failed to fetch tasks");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTugas();
    fetchPesertaList();
  }, []);

  const handleOpenAddModal = () => {
    setDeskripsiTugas("");
    setDeadline("");
    setSelectedPesertaId("");
    setIsEdit(false);
    setEditTugasId(null);
    setShowPopup(true);
  };

  const handleCloseModal = () => {
    setShowPopup(false);
    setDeskripsiTugas("");
    setDeadline("");
    setSelectedPesertaId("");
    setIsEdit(false);
    setEditTugasId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      const tugasData = {
        deskripsi: deskripsiTugas,
        deadline: new Date(deadline).toISOString(),
      };

      if (isEdit) {
        await axios.put(
          `https://web-baru.up.railway.app/pegawai/edit-tugas/${editTugasId}`,
          tugasData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Tugas berhasil diperbarui",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        if (!selectedPesertaId) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Silahkan pilih peserta terlebih dahulu",
          });
          return;
        }

        await axios.post(
          `https://web-baru.up.railway.app/pegawai/add-tugas/${selectedPesertaId}`,
          tugasData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Tugas berhasil ditambahkan",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      fetchTugas();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting tugas:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menambah tugas",
      });
    }
  };

  const handleEdit = (tugas) => {
    const deadlineDate = new Date(tugas.deadline);
    const formattedDeadline = deadlineDate.toISOString().slice(0, 16);

    setDeskripsiTugas(tugas.deskripsi);
    setDeadline(formattedDeadline);
    setShowPopup(true);
    setIsEdit(true);
    setEditTugasId(tugas.id);
  };

  const handleDeleteAdmin = async (id) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Tugas yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("accessToken");
          await axios.delete(`https://web-baru.up.railway.app/pegawai/delete-tugas/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            text: "Tugas berhasil dihapus",
            showConfirmButton: false,
            timer: 1500,
          });

          fetchTugas();
        } catch (error) {
          console.error("Error deleting tugas:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Anda tidak memiliki hak untuk tugas ini",
          });
        }
      }
    });
  };

  if (isLoading) return <div className={`text-center p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading...</div>;
  if (error) return <div className={`text-center p-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</div>;

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-indigo-900' : 'bg-gradient-to-br from-gray-50 to-indigo-50'} transition-colors duration-300`}>
      <Sidebar />
      <div className="flex-1 md:ml-[250px]">
        <Navbar />
        <main className="p-8 lg:p-12 mt-20 max-w-7xl mx-auto">
          <div className={`shadow-lg p-6 rounded-md ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-white text-gray-800 border-gray-100'} border transition-colors duration-300`}>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600/90'}`}>
              Rekapan Tugas
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total: {rekapanTugas.length} Tugas</p>

            <div className="my-4 flex items-center justify-center space-x-4">
              <Input
                type="text"
                placeholder="Cari berdasarkan Deskripsi"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                px={20}
                className={`w-full text-center max-w-lg border rounded-lg ${darkMode ? 'border-blue-400/90 bg-gray-700 text-gray-200' : 'border-blue-600/90 bg-white text-gray-800'} transition-colors`}
              />

              <Button
                label={"Tugas"}
                variant="blue"
                ikon={<Plus />}
                onClick={handleOpenAddModal}
                className={`${darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600/90 hover:bg-blue-700/90'} text-white transition-colors`}
              />
            </div>

            <div className="flex flex-col min-h-[600px]">
              <div className="flex-grow overflow-auto">
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr className={`${darkMode ? 'bg-blue-500/90 text-white' : 'bg-blue-600/90 text-white'}`}>
                      <th className={`p-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>No</th>
                      <th className={`p-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>Peserta</th>
                      <th className={`p-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>Deadline</th>
                      <th className={`p-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>Status</th>
                      <th className={`p-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>Pemberi Tugas</th>
                      <th className={`p-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>Deskripsi</th>
                      <th className={`p-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>Catatan</th>
                      <th className={`p-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((tugas, index) => (
                      <tr
                        key={tugas.id}
                        className={`${index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-gray-50') : (darkMode ? 'bg-gray-800' : 'bg-white')} hover:${darkMode ? 'bg-gray-500' : 'bg-blue-50'} ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                      >
                        <td className={`border p-4 text-sm ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className={`border p-2 text-sm ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                          {tugas.peserta?.nama || "-"}
                        </td>
                        <td className={`border p-2 text-sm ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                          {new Date(tugas.deadline).toLocaleDateString("id-ID")}
                        </td>
                        <td className={`border p-2 text-sm ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                          <span
                            className={`px-2 py-1 rounded-full ${
                              tugas.status === "Selesai"
                                ? darkMode ? 'bg-teal-900 text-green-300' : 'bg-teal-100 text-green-800'
                                : tugas.status === "Terlambat"
                                ? darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
                                : darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {tugas.status}
                          </span>
                        </td>
                        <td className={`border p-2 text-sm ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                          {tugas.pegawai?.nama || "-"}
                        </td>
                        <td className={`border p-2 text-sm ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                          {tugas.deskripsi}
                        </td>
                        <td className={`border p-2 text-sm ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                          {tugas.catatan}
                        </td>
                        <td className={`border p-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                          <div className="flex items-center justify-center space-x-4">
                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
                              <Pencil
                                className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'} cursor-pointer`}
                                onClick={() => handleEdit(tugas)}
                              />
                            </div>
                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
                              <Trash2
                                className={`${darkMode ? 'text-red-400' : 'text-red-600'} cursor-pointer`}
                                onClick={() => handleDeleteAdmin(tugas.id)}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              <div className="mt-auto pt-4 border-t">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                  >
                    <ChevronsLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-4 py-2 rounded-lg border ${
                              currentPage === pageNumber
                                ? darkMode ? 'bg-blue-500 text-white' : 'bg-blue-600/90 text-white'
                                : darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600'
                            } transition-colors`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber} className={`px-2 py-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>...</span>;
                      }
                      return null;
                    })}
                  </div>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                  >
                    <ChevronsRight className="h-5 w-5" />
                  </button>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-4`}>
                    Halaman {currentPage} dari {totalPages}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Modal isOpen={showPopup} onClose={handleCloseModal} darkMode={darkMode}>
            <form onSubmit={handleSubmit}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {isEdit ? "Edit Tugas Magang" : "Form Tugas Magang"}
              </h2>

              {!isEdit && (
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Peserta
                  </label>
                  <select
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white text-gray-800'}`}
                    value={selectedPesertaId}
                    onChange={(e) => setSelectedPesertaId(e.target.value)}
                    required
                  >
                    <option value="">Pilih Peserta</option>
                    {pesertaList.map((peserta) => (
                      <option key={peserta.id} value={peserta.id}>
                        {peserta.nama} - {peserta.nim}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Deskripsi Tugas
                </label>
                <textarea
                  className={`w-full px-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white text-gray-800'}`}
                  placeholder="Masukkan deskripsi tugas"
                  value={deskripsiTugas}
                  onChange={(e) => setDeskripsiTugas(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Deadline Tugas
                </label>
                <Input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className={`${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white text-gray-800'}`}
                />
              </div>

              <div className="flex justify-center">
                <Button
                  label={isEdit ? "Update Tugas" : "Tambah Tugas"}
                  variant="green"
                  type="submit"
                  className={`${darkMode ? 'bg-green-500 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white`}
                />
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default FormTugas;