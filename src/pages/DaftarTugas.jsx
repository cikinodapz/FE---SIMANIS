import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const DaftarTugas = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [catatan, setCatatan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

  // Fungsi untuk mengurutkan tugas berdasarkan deadline
  const sortTasks = (tasks, order) => {
    return tasks.sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return order === "newest" ? dateA - dateB : dateB - dateA;
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:3000/peserta/my-tugas",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setTasks(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tugas:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Gagal mengambil data tugas",
      });
      setError(error.response?.data?.message || "Failed to fetch tasks");
      setLoading(false);
    }
  };

  // Fungsi untuk mengatur pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Menghitung data yang akan ditampilkan di halaman saat ini
  const filteredTasksList = tasks.filter((task) =>
    task.pegawai.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTasksList = sortTasks([...filteredTasksList], sortOrder);

  useEffect(() => {
    setTotalPages(Math.ceil(sortedTasksList.length / tasksPerPage));
    setCurrentPage(1); // Reset ke halaman pertama ketika filter berubah
  }, [sortedTasksList.length, tasksPerPage]);

  // Get current tasks
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasksList.slice(indexOfFirstTask, indexOfLastTask);

  // Komponen Pagination
  const PaginationControls = () => (
    <div className="mt-4 flex items-center justify-center gap-2">
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
          // Tampilkan hanya 5 nomor halaman dengan halaman aktif di tengah
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
  );

  const handleUpdateStatus = async () => {
    if (!selectedTask) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:3000/peserta/tugas-selesai/${selectedTask.id}`,
        { catatan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowModal(false);
      setCatatan("");
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Status tugas berhasil diperbarui",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchTasks(); // Refresh the tasks list
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Gagal memperbarui status tugas",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openUpdateModal = async (task) => {
    const result = await Swal.fire({
      title: "Selesaikan Tugas?",
      text: "Apakah anda yakin ingin menyelesaikan tugas ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Selesaikan!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setSelectedTask(task);
      setCatatan(task.catatan || "");
      setShowModal(true);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-teal-100 text-green-800";
      case "Terlambat":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="flex max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] h-screen">
        <Navbar />
        <div className="p-[100px]">
          <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            <h1 className="text-blue-600/90 text-3xl font-bold">
              Daftar Tugas
            </h1>
            <p className="text-sm text-gray-500">Semua Daftar Tugas</p>
            <div className="my-4 flex items-center justify-center space-x-4">
              <Input
                type="text"
                placeholder="Cari berdasarkan nama pengarah"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="flex flex-col min-h-[600px]">
              {" "}
              {/* Fixed height container */}
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 flex-grow">
                  <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <svg
                      className="w-20 h-20 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Belum Ada Tugas
                  </h3>
                  <p className="text-gray-500 text-center max-w-sm">
                    Saat ini belum ada tugas yang diberikan. Silakan periksa
                    kembali nanti.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col flex-grow">
                  <div className="flex-grow overflow-auto">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-blue-600/90 text-white">
                        <tr>
                          <th className="p-2 border border-gray-300">
                            Pengarah
                          </th>
                          <th className="p-2 border border-gray-300">
                            Jabatan
                          </th>
                          <th className="p-2 border border-gray-300">
                            Deskripsi
                          </th>
                          <th className="p-2 border border-gray-300">
                            Deadline
                          </th>
                          <th className="p-2 border border-gray-300">Status</th>
                          <th className="p-2 border border-gray-300">
                            Catatan
                          </th>
                          <th className="p-2 border border-gray-300">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTasks.map((task) => (
                          <tr
                            key={task.id}
                            className="hover:bg-blue-50 text-center"
                          >
                            <td className="p-2 border border-gray-300">
                              {task.pegawai.nama}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {task.pegawai.jabatan}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {task.deskripsi}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {formatDate(task.deadline)}
                            </td>
                            <td className="border border-gray-300 align-middle">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                  task.status
                                )}`}
                              >
                                {task.status}
                              </span>
                            </td>
                            <td className="p-2 border border-gray-300">
                              {task.catatan}
                            </td>
                            <td className="p-2 border border-gray-300">
                              <button
                                onClick={() => openUpdateModal(task)}
                                disabled={
                                  task.status === "Selesai" ||
                                  task.status === "Terlambat"
                                }
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg transition-all duration-200 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Update Status
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination always at bottom */}
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
              )}
            </div>
            {/* // Ubah bagian modal code menjadi seperti ini (sisanya tetap sama) */}

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-96 relative z-50">
                  <h2 className="text-xl font-bold mb-4">
                    Update Status Tugas
                  </h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Catatan
                    </label>
                    <textarea
                      placeholder="Tambahkan catatan (opsional)"
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      rows="4"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                      disabled={isSubmitting}
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleUpdateStatus}
                      className="px-4 py-2 bg-blue-600/90 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Memproses..." : "Selesaikan Tugas"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaftarTugas;
