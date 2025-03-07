import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Swal from "sweetalert2";
import { DarkModeContext } from "../context/DarkModeContext";

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

  const { darkMode } = useContext(DarkModeContext);

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
      const response = await axios.get("https://web-baru.up.railway.app/peserta/my-tugas", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const filteredTasksList = tasks.filter((task) =>
    task.pegawai.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedTasksList = sortTasks([...filteredTasksList], sortOrder);

  useEffect(() => {
    setTotalPages(Math.ceil(sortedTasksList.length / tasksPerPage));
    setCurrentPage(1);
  }, [sortedTasksList.length, tasksPerPage]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasksList.slice(indexOfFirstTask, indexOfLastTask);

  const PaginationControls = () => (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button
        onClick={goToFirstPage}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="First page"
      >
        <ChevronsLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
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
                className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 ${
                  currentPage === pageNumber
                    ? "bg-blue-600/90 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                } transition-colors`}
              >
                {pageNumber}
              </button>
            );
          } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
            return (
              <span key={pageNumber} className="px-2 py-1 text-gray-600 dark:text-gray-400">
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
        className={`p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <button
        onClick={goToLastPage}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Last page"
      >
        <ChevronsRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-400 ml-4">
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
        `https://web-baru.up.railway.app/peserta/tugas-selesai/${selectedTask.id}`,
        { catatan },
        { headers: { Authorization: `Bearer ${token}` } }
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
      fetchTasks();
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
        return "bg-teal-100 text-green-800 dark:bg-teal-900 dark:text-green-200";
      case "Terlambat":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 dark:text-red-400">
        Error: {error}
      </div>
    );

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 md:ml-[250px]">
          <Navbar />
          <div className="p-8 lg:p-12 mt-20 max-w-7xl mx-auto">
            <div className="shadow-lg p-6 bg-white dark:bg-gray-800 rounded-2xl bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Daftar Tugas</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Semua Daftar Tugas</p>
              <div className="my-4 flex items-center justify-center space-x-4">
                <Input
                  type="text"
                  placeholder="Cari berdasarkan nama pengarah"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-center max-w-lg border border-blue-600/90 dark:border-blue-400/90 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                </select>
              </div>
              <div className="flex flex-col min-h-[600px]">
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 flex-grow">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-4">
                      <svg
                        className="w-20 h-20 text-gray-400 dark:text-gray-500"
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
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Belum Ada Tugas
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                      Saat ini belum ada tugas yang diberikan. Silakan periksa kembali nanti.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col flex-grow">
                    <div className="flex-grow overflow-auto">
                      <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-blue-600/90 dark:bg-blue-500/90 text-white">
                          <tr>
                            <th className="p-2 border border-gray-300 dark:border-gray-600">Pengarah</th>
                            <th className="p-2 border border-gray-300 dark:border-gray-600">Jabatan</th>
                            <th className="p-2 border border-gray-300 dark:border-gray-600">Deskripsi</th>
                            <th className="p-2 border border-gray-300 dark:border-gray-600">Deadline</th>
                            <th className="p-2 border border-gray-300 dark:border-gray-600">Status</th>
                            <th className="p-2 border border-gray-300 dark:border-gray-600">Catatan</th>
                            <th className="p-2 border border-gray-300 dark:border-gray-600">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTasks.map((task) => (
                            <tr key={task.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 text-center text-gray-800 dark:text-gray-200">
                              <td className="p-2 border border-gray-300 dark:border-gray-600">{task.pegawai.nama}</td>
                              <td className="p-2 border border-gray-300 dark:border-gray-600">{task.pegawai.jabatan}</td>
                              <td className="p-2 border border-gray-300 dark:border-gray-600">{task.deskripsi}</td>
                              <td className="p-2 border border-gray-300 dark:border-gray-600">{formatDate(task.deadline)}</td>
                              <td className="border border-gray-300 dark:border-gray-600 align-middle">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                                  {task.status}
                                </span>
                              </td>
                              <td className="p-2 border border-gray-300 dark:border-gray-600">{task.catatan}</td>
                              <td className="p-2 border border-gray-300 dark:border-gray-600">
                                <button
                                  onClick={() => openUpdateModal(task)}
                                  disabled={task.status === "Selesai" || task.status === "Terlambat"}
                                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 rounded-lg transition-all duration-200 hover:from-blue-600 hover:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Update Status
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-600">
                      <PaginationControls />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1060] transition-colors duration-300">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Update Status Tugas</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Catatan</label>
              <textarea
                placeholder="Tambahkan catatan (opsional)"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                rows="4"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-600/90 dark:bg-blue-500 text-white rounded hover:bg-blue-700/90 dark:hover:bg-blue-600 disabled:opacity-50 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memproses..." : "Selesaikan Tugas"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DaftarTugas;