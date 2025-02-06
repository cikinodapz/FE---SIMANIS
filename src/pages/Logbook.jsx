import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import Swal from "sweetalert2";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Edit,
  Trash,
} from "lucide-react";

const Logbook = () => {
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentLogbook, setCurrentLogbook] = useState(null);
  const [formData, setFormData] = useState({
    tanggal: "",
    kegiatan: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [statistics, setStatistics] = useState({
    totalAllTime: 0,
    totalThisMonth: 0,
  });

  useEffect(() => {
    fetchLogbooks();
  }, []);

  const fetchLogbooks = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:3000/peserta/my-logbook", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setLogbooks(response.data.data.logbooks);
        setStatistics(response.data.data.statistics);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching logbooks:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Gagal mengambil data logbook",
      });
      setError(error.response?.data?.message || "Failed to fetch logbooks");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const url = currentLogbook
        ? `http://localhost:3000/peserta/edit-logbook/${currentLogbook.id}`
        : "http://localhost:3000/peserta/add-logbook";
      const method = currentLogbook ? "put" : "post";

      await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Logbook berhasil ${currentLogbook ? "diupdate" : "ditambahkan"}`,
        showConfirmButton: false,
        timer: 1500,
      });

      setShowModal(false);
      setCurrentLogbook(null);
      setFormData({ tanggal: "", kegiatan: "" });
      fetchLogbooks();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || `Gagal ${currentLogbook ? "mengupdate" : "menambahkan"} logbook`,
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Logbook?",
      text: "Anda yakin ingin menghapus logbook ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");
        await axios.delete(`http://localhost:3000/peserta/delete-logbook/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Logbook berhasil dihapus",
          showConfirmButton: false,
          timer: 1500,
        });

        fetchLogbooks();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || "Gagal menghapus logbook",
        });
      }
    }
  };

  const filteredLogbooks = logbooks.filter((logbook) =>
    logbook.kegiatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogbooks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    setTotalPages(Math.ceil(filteredLogbooks.length / itemsPerPage));
  }, [filteredLogbooks, itemsPerPage]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] h-screen">
        <Navbar />
        <div className="p-[100px]">
          <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-blue-600/90 text-3xl font-bold">Logbook</h1>
                <p className="text-sm text-gray-500">Catatan Kegiatan Harian</p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <Input
                type="text"
                placeholder="Cari berdasarkan kegiatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <button
                onClick={() => {
                  setCurrentLogbook(null);
                  setFormData({ tanggal: "", kegiatan: "" });
                  setShowModal(true);
                }}
                className="bg-blue-600/90 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Tambah Logbook
              </button>
            </div>

            <div className="min-h-[400px]">
              {logbooks.length === 0 ? (
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Belum Ada Logbook
                  </h3>
                  <p className="text-gray-500 text-center max-w-sm">
                    Anda belum memiliki catatan kegiatan. Klik tombol "Tambah Logbook" untuk
                    membuat catatan baru.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-blue-600/90 text-white">
                      <tr>
                        <th className="p-3 text-left">Tanggal</th>
                        <th className="p-3 text-left">Kegiatan</th>
                        <th className="p-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((logbook) => (
                        <tr key={logbook.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{formatDate(logbook.tanggal)}</td>
                          <td className="p-3">{logbook.kegiatan}</td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => {
                                  setCurrentLogbook(logbook);
                                  setFormData({
                                    tanggal: new Date(logbook.tanggal).toISOString().split("T")[0],
                                    kegiatan: logbook.kegiatan,
                                  });
                                  setShowModal(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(logbook.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {logbooks.length > 0 && (
              <div className="mt-4 flex justify-center items-center gap-2">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronsLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {/* Page numbers */}
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
                              ? "bg-blue-600/90 text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronsRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Modal Form */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-96">
                  <h2 className="text-xl font-bold mb-4">
                    {currentLogbook ? "Edit Logbook" : "Tambah Logbook"}
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Tanggal
                      </label>
                      <input
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) =>
                          setFormData({ ...formData, tanggal: e.target.value })
                        }
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Kegiatan
                      </label>
                      <textarea
                        value={formData.kegiatan}
                        onChange={(e) =>
                          setFormData({ ...formData, kegiatan: e.target.value })
                        }
                        className="w-full p-2 border rounded-md"
                        rows="4"
                        placeholder="Masukkan kegiatan anda..."
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setCurrentLogbook(null);
                          setFormData({ tanggal: "", kegiatan: "" });
                        }}
                        className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600/90 text-white rounded hover:bg-blue-700"
                      >
                        {currentLogbook ? "Update" : "Simpan"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logbook;