import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import Select from "../components/Select";
import { Search } from "lucide-react";
import Swal from "sweetalert2";

const DaftarTugas = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [catatan, setCatatan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest"); // State untuk menyimpan opsi pengurutan

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Selesai", label: "Selesai" },
    { value: "Terlambat", label: "Terlambat" },
  ];

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

  const sortTasks = (tasks, order) => {
    return tasks.sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return order === "newest" ? dateA - dateB : dateB - dateA;
    });
  };

  const filteredTasks = tasks.filter((task) =>
    task.pegawai.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTasks = sortTasks([...filteredTasks], sortOrder);

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
    <div className="flex shadow max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] mx-auto h-screen">
        <Navbar />
        <div className="p-[100px]">
          <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            <h1 className="text-blue-premier text-3xl font-bold">
              Daftar Tugas
            </h1>
            <p className="text-sm text-gray-500">Semua Daftar Tugas</p>

            <div className="my-4 flex items-center justify-center space-x-4">
              <Input
                type="text"
                placeholder="Cari berdasarkan nama pengarah"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            {/* Tambahkan kondisi pengecekan tasks kosong disini */}
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
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
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-premier text-white border-rounded-lg">
                    <th className="p-2 border border-gray-300">Pengarah</th>
                    <th className="p-2 border border-gray-300">Jabatan</th>
                    <th className="p-2 border border-gray-300">Deskripsi</th>
                    <th className="p-2 border border-gray-300">Deadline</th>
                    <th className="p-2 border border-gray-300">Status</th>
                    <th className="p-2 border border-gray-300">Catatan</th>
                    <th className="p-2 border border-gray-300">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-blue-50 text-center">
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
            )}

            {/* Simple Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg w-96">
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
                      className="px-4 py-2 bg-blue-premier text-white rounded hover:bg-blue-600 disabled:opacity-50"
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
