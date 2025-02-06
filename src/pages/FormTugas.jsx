import React, { useState, useEffect } from "react";
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

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
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
  const [sortBy, setSortBy] = useState("createdAt"); // Kolom default untuk sorting
  const [sortOrder, setSortOrder] = useState("asc"); // Arah default: ascending

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  // Pagination functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const filteredTugasPaging = rekapanTugas
  .filter((tugas) =>
    tugas.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    // Sorting berdasarkan kolom yang dipilih
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
        // Convert to string, handle null/undefined, and use lowercase
        valueA = String(a.peserta?.nama || "").trim().toLowerCase();
        valueB = String(b.peserta?.nama || "").trim().toLowerCase();
        break;
      default:
        valueA = new Date(a.createdAt);
        valueB = new Date(b.createdAt);
        break;
    }
    // Urutkan ascending atau descending
    if (sortOrder === "asc") {
      // Perbandingan manual untuk berbagai tipe data
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB);
      }
      return valueA > valueB ? 1 : -1;
    } else {
      // Untuk descending
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueB.localeCompare(valueA);
      }
      return valueA < valueB ? 1 : -1;
    }
  });

  // Update total pages when filtered data changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredTugasPaging.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filteredTugasPaging.length, itemsPerPage]);

  // Get current items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTugasPaging.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const fetchPesertaList = async () => {
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

      if (response.data && response.data.biodatas) {
        setPesertaList(response.data.biodatas);
      }
    } catch (error) {
      console.error("Error fetching peserta:", error);
    }
  };

  // Kemudian di bagian dropdown peserta:
  <select
    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md"
    value={selectedPesertaId}
    onChange={(e) => setSelectedPesertaId(e.target.value)}
    required
  >
    <option value="">Pilih Peserta</option>
    {pesertaList
      .filter((peserta) => peserta.status_peserta === "Aktif")
      .map((peserta) => (
        <option key={peserta.id} value={peserta.id}>
          {peserta.nama} - {peserta.nim} - {peserta.jurusan}
        </option>
      ))}
  </select>;

  const fetchTugas = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:3000/admin/list-tugas",
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
    // Reset semua state ke nilai awal
    setDeskripsiTugas("");
    setDeadline("");
    setSelectedPesertaId("");
    setIsEdit(false);
    setEditTugasId(null);
    setShowPopup(true);
  };

  const handleCloseModal = () => {
    // Reset semua state ke nilai awal
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
          `http://localhost:3000/admin/edit-tugas/${editTugasId}`,
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
          `http://localhost:3000/admin/add-tugas/${selectedPesertaId}`,
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

      setShowPopup(false);
      setDeskripsiTugas("");
      setDeadline("");
      setSelectedPesertaId("");
      setIsEdit(false);
      setEditTugasId(null);
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
    // Format deadline ke format datetime-local yang sesuai
    const deadlineDate = new Date(tugas.deadline);
    const formattedDeadline = deadlineDate.toISOString().slice(0, 16); // format: "YYYY-MM-DDTHH:mm"

    setDeskripsiTugas(tugas.deskripsi);
    setDeadline(formattedDeadline);
    setShowPopup(true);
    setIsEdit(true);
    setEditTugasId(tugas.id);

    // Log untuk debugging
    console.log("Edit Tugas:", {
      id: tugas.id,
      deskripsi: tugas.deskripsi,
      deadline: formattedDeadline,
    });
  };

  // Update handleDeleteAdmin juga dengan Sweet Alert
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
          await axios.delete(`http://localhost:3000/admin/delete-tugas/${id}`, {
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
            text: "Terjadi kesalahan saat menghapus tugas",
          });
        }
      }
    });
  };

  

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-600 p-4">{error}</div>;

  return (
    <div className="flex max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] mx-auto h-screen">
        <Navbar />
        <main className="p-[100px]">
          <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            <h2 className="text-blue-600/90 text-3xl font-bold">
              Rekapan Tugas
            </h2>
            <p className="text-sm text-gray-500">
              Total: {rekapanTugas.length} Tugas
            </p>

            <div className="my-4 flex items-center justify-center space-x-4">
              <Input
                type="text"
                placeholder="Cari berdasarkan Deskripsi"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                px={20}
                className="w-full text-center max-w-lg border border-blue-600/90 rounded-lg"
              />

              {/* Dropdown untuk memilih kolom sorting */}
              <select
                className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Sort by Tanggal Dibuat</option>
                <option value="deadline">Sort by Deadline</option>
                <option value="status">Sort by Status</option>
                <option value="peserta">Sort by Nama Peserta</option>
              </select>

              {/* Tombol untuk memilih arah sorting */}
              <button
                className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
              </button>

              <Button
                label={"Tugas"}
                variant="blue"
                ikon={<Plus />}
                onClick={handleOpenAddModal}
              />
            </div>

            <div className="flex flex-col min-h-[600px]">
              <div className="flex-grow overflow-auto">
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr className="bg-blue-600/90 text-white border-lg">
                      <th className="p-2 border border-gray-300">No</th>
                      <th className="p-2 border border-gray-300">Peserta</th>
                      <th className="p-2 border border-gray-300">Deadline</th>
                      <th className="p-2 border border-gray-300">Status</th>
                      <th className="p-2 border border-gray-300">
                        Pemberi Tugas
                      </th>
                      <th className="p-2 border border-gray-300">Deskripsi</th>
                      <th className="p-2 border border-gray-300">Catatan</th>
                      <th className="p-2 border border-gray-300">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((tugas, index) => (
                      <tr
                        key={tugas.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-blue-50`}
                      >
                        <td className="border border-gray-300 p-4 text-sm">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm">
                          {tugas.peserta?.nama || "-"}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm">
                          {new Date(tugas.deadline).toLocaleDateString("id-ID")}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full ${
                              tugas.status === "Selesai"
                                ? "bg-teal-100 text-green-800"
                                : tugas.status === "Terlambat"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {tugas.status}
                          </span>
                        </td>

                        <td className="border border-gray-300 p-2 text-sm">
                          {tugas.pegawai?.nama || "-"}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm">
                          {tugas.deskripsi}{" "}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm">
                          {tugas.catatan}
                        </td>
                        <td className="border border-gray-300 p-2">
                          <div className="flex items-center justify-center space-x-4">
                            <div className="p-2 rounded-lg bg-yellow-50 shadow-lg">
                              <Pencil
                                className="text-yellow-600 cursor-pointer"
                                onClick={() => handleEdit(tugas)}
                              />
                            </div>
                            <div className="p-2 rounded-lg bg-red-100 shadow-lg">
                              <Trash2
                                className="text-red-600 cursor-pointer"
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

          <Modal isOpen={showPopup} onClose={() => setShowPopup(false)}>
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {isEdit ? "Edit Tugas Magang" : "Form Tugas Magang"}
              </h2>

              {!isEdit && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peserta
                  </label>
                  <select
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Tugas
                </label>
                <textarea
                  className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md"
                  placeholder="Masukkan deskripsi tugas"
                  value={deskripsiTugas}
                  onChange={(e) => setDeskripsiTugas(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline Tugas
                </label>
                <Input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-center">
                <Button
                  label={isEdit ? "Update Tugas" : "Tambah Tugas"}
                  variant="green"
                  type="submit"
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
