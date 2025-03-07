import React, { useState, useEffect, useContext } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DeletedAlert from "../components/DeletedAlert";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { DarkModeContext } from "../context/DarkModeContext";

const Modal = ({ children, isOpen, onClose }) => {
  const { darkMode } = useContext(DarkModeContext);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 ${
        darkMode ? "bg-black/70" : "bg-black/50"
      } flex items-center justify-center z-50`}
    >
      <div
        className={`p-6 rounded-lg shadow-lg max-w-lg w-full relative ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${
            darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

const FormTugas = () => {
  const { darkMode } = useContext(DarkModeContext);
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
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const filteredTugasPaging = rekapanTugas
    .filter((tugas) =>
      tugas.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let valueA, valueB;
      switch (sortBy) {
        case "deadline":
          valueA = new Date(a.deadline);
          valueB = new Date(b.deadline);
          break;
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        case "peserta":
          valueA = String(a.peserta?.nama || "").trim().toLowerCase();
          valueB = String(b.peserta?.nama || "").trim().toLowerCase();
          break;
        default:
          valueA = new Date(a.createdAt);
          valueB = new Date(b.createdAt);
          break;
      }
      if (sortOrder === "asc") {
        if (typeof valueA === "string" && typeof valueB === "string") {
          return valueA.localeCompare(valueB);
        }
        return valueA > valueB ? 1 : -1;
      } else {
        if (typeof valueA === "string" && typeof valueB === "string") {
          return valueB.localeCompare(valueA);
        }
        return valueA < valueB ? 1 : -1;
      }
    });

  useEffect(() => {
    setTotalPages(Math.ceil(filteredTugasPaging.length / itemsPerPage));
    setCurrentPage(1);
  }, [filteredTugasPaging.length, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTugasPaging.slice(indexOfFirstItem, indexOfLastItem);

  const fetchPesertaList = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://web-baru.up.railway.app/admin/list-peserta",
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
        "https://web-baru.up.railway.app/admin/list-tugas",
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
          `https://web-baru.up.railway.app/admin/edit-tugas/${editTugasId}`,
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
          background: darkMode ? "#1f2937" : "#fff",
          confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
        });
      } else {
        if (!selectedPesertaId) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Silahkan pilih peserta terlebih dahulu",
            background: darkMode ? "#1f2937" : "#fff",
            confirmButtonColor: darkMode ? "#dc2626" : "#d33",
          });
          return;
        }

        await axios.post(
          `https://web-baru.up.railway.app/admin/add-tugas/${selectedPesertaId}`,
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
          background: darkMode ? "#1f2937" : "#fff",
          confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
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
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
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

    console.log("Edit Tugas:", {
      id: tugas.id,
      deskripsi: tugas.deskripsi,
      deadline: formattedDeadline,
    });
  };

  const handleDeleteAdmin = async (id) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Tugas yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: darkMode ? "#dc2626" : "#3085d6",
      cancelButtonColor: darkMode ? "#2563eb" : "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      background: darkMode ? "#1f2937" : "#fff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("accessToken");
          await axios.delete(`https://web-baru.up.railway.app/admin/delete-tugas/${id}`, {
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
            background: darkMode ? "#1f2937" : "#fff",
            confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
          });

          fetchTugas();
        } catch (error) {
          console.error("Error deleting tugas:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan saat menghapus tugas",
            background: darkMode ? "#1f2937" : "#fff",
            confirmButtonColor: darkMode ? "#dc2626" : "#d33",
          });
        }
      }
    });
  };

  if (isLoading)
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            darkMode ? "border-blue-400" : "border-blue-600"
          }`}
        ></div>
      </div>
    );
  if (error)
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode ? "text-red-400" : "text-red-600"
        }`}
      >
        {error}
      </div>
    );

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
        <main className="p-8 lg:p-12 mt-20 max-w-7xl mx-auto">
          <div
            className={`shadow-lg p-6 ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
            } rounded-2xl bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm border transition-colors duration-300`}
          >
            <h2
              className={`text-3xl font-bold ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              Rekapan Tugas
            </h2>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Total: {rekapanTugas.length} Tugas
            </p>

            <div className="my-4 flex items-center justify-center space-x-4">
              <Input
                type="text"
                placeholder="Cari berdasarkan Deskripsi"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                px={20}
                className={`w-full text-center max-w-lg rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-gray-50 border-blue-600/90 text-gray-800"
                }`}
              />

              <select
                className={`px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Sort by Tanggal Dibuat</option>
                <option value="deadline">Sort by Deadline</option>
                <option value="status">Sort by Status</option>
                <option value="peserta">Sort by Nama Peserta</option>
              </select>

              <button
                className={`px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                    : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
              </button>

              <Button
                label="Tugas"
                variant="blue"
                ikon={<Plus />}
                onClick={handleOpenAddModal}
                className={`${
                  darkMode ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"
                }`}
              />
            </div>

            <div className="flex flex-col min-h-[600px]">
              <div className="flex-grow overflow-auto">
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
                      <th className="p-2">Peserta</th>
                      <th className="p-2">Deadline</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Pemberi Tugas</th>
                      <th className="p-2">Deskripsi</th>
                      <th className="p-2">Catatan</th>
                      <th className="p-2">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((tugas, index) => (
                      <tr
                        key={tugas.id}
                        className={`${
                          index % 2 === 0
                            ? darkMode
                              ? "bg-gray-800"
                              : "bg-gray-50"
                            : darkMode
                            ? "bg-gray-900"
                            : "bg-white"
                        } ${darkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"}`}
                      >
                        <td className="p-4 text-sm">{indexOfFirstItem + index + 1}</td>
                        <td className="p-2 text-sm">{tugas.peserta?.nama || "-"}</td>
                        <td className="p-2 text-sm">
                          {new Date(tugas.deadline).toLocaleDateString("id-ID")}
                        </td>
                        <td className="p-2 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full ${
                              tugas.status === "Selesai"
                                ? darkMode
                                  ? "bg-teal-900 text-teal-300"
                                  : "bg-teal-100 text-green-800"
                                : tugas.status === "Terlambat"
                                ? darkMode
                                  ? "bg-red-900 text-red-300"
                                  : "bg-red-100 text-red-800"
                                : darkMode
                                ? "bg-yellow-900 text-yellow-300"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {tugas.status}
                          </span>
                        </td>
                        <td className="p-2 text-sm">{tugas.pegawai?.nama || "-"}</td>
                        <td className="p-2 text-sm">{tugas.deskripsi}</td>
                        <td className="p-2 text-sm">{tugas.catatan}</td>
                        <td className="p-2">
                          <div className="flex items-center justify-center space-x-4">
                            <div
                              className={`p-2 rounded-lg ${
                                darkMode ? "bg-yellow-900/50" : "bg-yellow-50"
                              } shadow-lg`}
                            >
                              <Pencil
                                className={`${
                                  darkMode ? "text-yellow-300" : "text-yellow-600"
                                } cursor-pointer`}
                                onClick={() => handleEdit(tugas)}
                              />
                            </div>
                            <div
                              className={`p-2 rounded-lg ${
                                darkMode ? "bg-red-900/50" : "bg-red-100"
                              } shadow-lg`}
                            >
                              <Trash2
                                className={`${
                                  darkMode ? "text-red-300" : "text-red-600"
                                } cursor-pointer`}
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
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
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

          <Modal isOpen={showPopup} onClose={handleCloseModal}>
            <form onSubmit={handleSubmit}>
              <h2
                className={`text-2xl font-bold mb-6 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {isEdit ? "Edit Tugas Magang" : "Form Tugas Magang"}
              </h2>

              {!isEdit && (
                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Peserta
                  </label>
                  <select
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
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
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Deskripsi Tugas
                </label>
                <textarea
                  className={`w-full px-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  placeholder="Masukkan deskripsi tugas"
                  value={deskripsiTugas}
                  onChange={(e) => setDeskripsiTugas(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Deadline Tugas
                </label>
                <Input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className={`w-full ${
                    darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
                  }`}
                />
              </div>

              <div className="flex justify-center">
                <Button
                  label={isEdit ? "Update Tugas" : "Tambah Tugas"}
                  variant="green"
                  type="submit"
                  className={`${
                    darkMode ? "bg-green-500 hover:bg-green-600" : "bg-green-600 hover:bg-green-700"
                  }`}
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