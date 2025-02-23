import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import {
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { DarkModeContext } from "../context/DarkModeContext";

const Kelompok = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [kelompokList, setKelompokList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchKelompok();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const filteredKelompok = kelompokList.filter(
    (kelompok) =>
      kelompok.instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kelompok.nama_ketua.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kelompok.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredKelompok.length / itemsPerPage));
    setCurrentPage(1);
  }, [filteredKelompok.length, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKelompok.slice(indexOfFirstItem, indexOfLastItem);

  const fetchKelompok = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:3000/admin/list-kelompok",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.kelompok) {
        setKelompokList(response.data.kelompok);
      }
    } catch (error) {
      console.error("Error fetching kelompok:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat memuat data kelompok",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewDocument = async (filename, type) => {
    try {
      const token = localStorage.getItem("accessToken");
      const fileName = filename.split("\\").pop();

      console.log("Attempting to fetch document:", fileName);

      const response = await axios.get(
        `http://localhost:3000/admin/preview-surat/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setSelectedFile({
        url,
        type,
        originalPath: filename,
      });
    } catch (error) {
      console.error("Error fetching document:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error.response?.status === 404
            ? "Dokumen tidak ditemukan"
            : "Terjadi kesalahan saat membuka dokumen",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
    }
  };

  const handleDownloadDocument = async (filename, type) => {
    try {
      const token = localStorage.getItem("accessToken");
      const fileName = filename.split("\\").pop();

      console.log("Attempting to download document:", fileName);

      const response = await axios.get(
        `http://localhost:3000/admin/download-surat/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Dokumen berhasil diunduh",
        timer: 1500,
        showConfirmButton: false,
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error.response?.status === 404
            ? "Dokumen tidak ditemukan"
            : "Terjadi kesalahan saat mengunduh dokumen",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
    }
  };

  const handleApprove = async (id, nama_ketua) => {
    const result = await Swal.fire({
      title: "Konfirmasi Persetujuan",
      html: `Apakah Anda yakin ingin menyetujui kelompok dengan ketua <b>${nama_ketua}</b>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: darkMode ? "#14b8a6" : "#14b8a6",
      cancelButtonColor: darkMode ? "#dc2626" : "#d33",
      confirmButtonText: "Ya, Setujui!",
      cancelButtonText: "Batal",
      background: darkMode ? "#1f2937" : "#fff",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Memproses...",
        html: "Sedang mengirim email penerimaan...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        background: darkMode ? "#1f2937" : "#fff",
      });

      try {
        const token = localStorage.getItem("accessToken");
        await axios.put(
          `http://localhost:3000/admin/approve-user/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Email penerimaan telah dikirim ke kelompok",
          timer: 2000,
          showConfirmButton: false,
          background: darkMode ? "#1f2937" : "#fff",
          confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
        });

        fetchKelompok();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            error.response?.data?.error ||
            "Terjadi kesalahan saat menyetujui kelompok",
          background: darkMode ? "#1f2937" : "#fff",
          confirmButtonColor: darkMode ? "#dc2626" : "#d33",
        });
      }
    }
  };

  const handleReject = async (id, nama_ketua) => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi Penolakan",
      html: `Apakah Anda yakin ingin menolak kelompok dengan ketua <b>${nama_ketua}</b>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      cancelButtonColor: darkMode ? "#2563eb" : "#3085d6",
      confirmButtonText: "Ya, Tolak!",
      cancelButtonText: "Batal",
      background: darkMode ? "#1f2937" : "#fff",
    });

    if (confirmResult.isConfirmed) {
      const reasonResult = await Swal.fire({
        title: "Alasan Penolakan",
        input: "textarea",
        inputLabel: "Mohon masukkan alasan penolakan",
        inputPlaceholder: "Tulis alasan penolakan di sini...",
        inputAttributes: {
          "aria-label": "Tulis alasan penolakan di sini",
        },
        showCancelButton: true,
        confirmButtonText: "Kirim",
        cancelButtonText: "Batal",
        confirmButtonColor: darkMode ? "#60a5fa" : "#60a5fa",
        cancelButtonColor: darkMode ? "#94a3b8" : "#94a3b8",
        background: darkMode ? "#1f2937" : "#fff",
        inputValidator: (value) => {
          if (!value) {
            return "Anda harus menulis alasan penolakan!";
          }
        },
      });

      if (reasonResult.isConfirmed) {
        Swal.fire({
          title: "Memproses...",
          html: "Sedang mengirim email penolakan...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          background: darkMode ? "#1f2937" : "#fff",
        });

        try {
          const token = localStorage.getItem("accessToken");
          await axios.put(
            `http://localhost:3000/admin/reject-user/${id}`,
            {
              catatan: reasonResult.value,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Email penolakan telah dikirim ke kelompok",
            timer: 2000,
            showConfirmButton: false,
            background: darkMode ? "#1f2937" : "#fff",
            confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
          });

          fetchKelompok();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text:
              error.response?.data?.error ||
              "Terjadi kesalahan saat menolak kelompok",
            background: darkMode ? "#1f2937" : "#fff",
            confirmButtonColor: darkMode ? "#dc2626" : "#d33",
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div
        className={`flex min-h-screen ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 to-indigo-900"
            : "bg-gradient-to-br from-gray-50 to-indigo-50"
        } transition-colors duration-300`}
      >
        <Sidebar />
        <div className="flex-1 md:ml-[250px] h-screen">
          <Navbar />
          <div className="p-8 lg:p-12 mt-20 flex justify-center items-center">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                darkMode ? "border-blue-400" : "border-blue-600"
              }`}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-indigo-900"
          : "bg-gradient-to-br from-gray-50 to-indigo-50"
        } transition-colors duration-300`}
    >
      <Sidebar />
      <div className="flex-1 md:ml-[250px] h-screen">
        <Navbar />
        <div className="p-8 lg:p-12 mt-20 max-w-7xl mx-auto">
          <div
            className={`shadow-lg p-6 ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
            } rounded-2xl bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm border transition-colors duration-300`}
          >
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              Daftar Kelompok
            </h1>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Total: {kelompokList.length} Kelompok
            </p>

            <div className="my-4 flex items-center justify-center space-x-4">
              <Input
                type="text"
                placeholder="Cari berdasarkan Nama/Email/Institusi"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                px={20}
                className={`w-full text-center max-w-lg rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-gray-50 border-blue-600/90 text-gray-800"
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
                  <thead
                    className={`sticky top-0 ${
                      darkMode ? "bg-blue-600" : "bg-blue-600/90"
                    } text-white`}
                  >
                    <tr>
                      <th className="p-2">No</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Ketua</th>
                      <th className="p-2">Institusi</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Surat Pengantar</th>
                      <th className="p-2">Surat Balasan</th>
                      <th className="p-2">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((kelompok, index) => (
                      <tr
                        key={kelompok.id}
                        className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"}`}
                      >
                        <td className="p-4 text-sm">{indexOfFirstItem + index + 1}</td>
                        <td className="p-2">{kelompok.email}</td>
                        <td className="p-2">{kelompok.nama_ketua}</td>
                        <td className="p-2">{kelompok.instansi}</td>
                        <td className="p-2">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              kelompok.status === "Diterima"
                                ? darkMode
                                  ? "bg-teal-900 text-teal-300"
                                  : "bg-teal-500 text-white"
                                : kelompok.status === "Ditolak"
                                ? darkMode
                                  ? "bg-red-900 text-red-300"
                                  : "bg-red-500 text-white"
                                : darkMode
                                ? "bg-yellow-900 text-yellow-300"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {kelompok.status}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() =>
                                handlePreviewDocument(
                                  kelompok.surat_pengantar,
                                  "Surat Pengantar"
                                )
                              }
                              className={`p-2 shadow-lg rounded-lg ${
                                darkMode
                                  ? "bg-gray-700 hover:bg-gray-600"
                                  : "bg-white hover:bg-blue-50"
                              }`}
                            >
                              <Eye
                                className={`${
                                  darkMode ? "text-blue-400" : "text-blue-600"
                                }`}
                              />
                            </button>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() =>
                                handlePreviewDocument(
                                  kelompok.surat_balasan,
                                  "Surat Balasan"
                                )
                              }
                              className={`p-2 shadow-lg rounded-lg ${
                                darkMode
                                  ? "bg-gray-700 hover:bg-gray-600"
                                  : "bg-white hover:bg-blue-50"
                              }`}
                            >
                              <Eye
                                className={`${
                                  darkMode ? "text-orange-400" : "text-orange-500"
                                }`}
                              />
                            </button>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center justify-center space-x-2">
                            {kelompok.status !== "Diterima" &&
                              kelompok.status !== "Ditolak" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleApprove(kelompok.id, kelompok.nama_ketua)
                                    }
                                    className={`p-2 rounded-lg transition-colors ${
                                      darkMode
                                        ? "bg-teal-600 hover:bg-teal-700"
                                        : "bg-teal-500 hover:bg-green-600"
                                    }`}
                                    title="Setujui"
                                  >
                                    <Check className="text-white h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleReject(kelompok.id, kelompok.nama_ketua)
                                    }
                                    className={`p-2 rounded-lg transition-colors ${
                                      darkMode
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-red-500 hover:bg-red-600"
                                    }`}
                                    title="Tolak"
                                  >
                                    <X className="text-white h-4 w-4" />
                                  </button>
                                </>
                              )}
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
        </div>

        {/* Modal Preview Dokumen */}
        {selectedFile && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${
              darkMode ? "bg-black/70" : "bg-black/50"
            }`}
          >
            <div
              className={`rounded-lg shadow-xl w-[90%] max-w-4xl max-h-[90vh] flex flex-col ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className={`flex justify-between items-center p-4 border-b ${
                  darkMode ? "text-gray-200 border-gray-700" : "text-gray-800 border-gray-200"
                }`}
              >
                <h2 className="text-xl font-bold">{selectedFile.type}</h2>
                <button
                  onClick={() => {
                    URL.revokeObjectURL(selectedFile.url);
                    setSelectedFile(null);
                  }}
                  className={`${
                    darkMode
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-grow p-4 overflow-auto">
                <iframe
                  src={selectedFile.url}
                  className="w-full h-[60vh] rounded"
                  title="Document Viewer"
                  style={{
                    backgroundColor: darkMode ? "#1f2937" : "#fff",
                  }}
                />
              </div>
              <div
                className={`p-4 border-t ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                } flex justify-end space-x-2`}
              >
                <button
                  onClick={() => {
                    URL.revokeObjectURL(selectedFile.url);
                    setSelectedFile(null);
                  }}
                  className={`px-4 py-2 rounded ${
                    darkMode
                      ? "bg-gray-600 text-gray-200 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Tutup
                </button>
                <button
                  onClick={() =>
                    handleDownloadDocument(selectedFile.originalPath, selectedFile.type)
                  }
                  className={`px-4 py-2 rounded ${
                    darkMode
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Unduh
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kelompok;