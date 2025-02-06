import React, { useState, useEffect } from "react";
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

const Kelompok = () => {
  const [kelompokList, setKelompokList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKelompok();
  }, []);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchKelompok();
  }, []);

  // Pagination functions
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const filteredKelompokKedua = kelompokList.filter(
    (kelompok) =>
      kelompok.instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kelompok.nama_ketua.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kelompok.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update total pages when filtered data changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredKelompokKedua.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filteredKelompokKedua.length, itemsPerPage]);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKelompokKedua.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewDocument = async (filename, type) => {
    try {
      const token = localStorage.getItem("accessToken");

      // Extract just the filename from the full path
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
        originalPath: filename, // Store original filename for download
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
      });
    }
  };

  const handleDownloadDocument = async (filename, type) => {
    try {
      const token = localStorage.getItem("accessToken");

      // Extract just the filename from the full path
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

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Dokumen berhasil diunduh",
        timer: 1500,
        showConfirmButton: false,
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
      });
    }
  };

  const handleApprove = async (id, nama_ketua) => {
    const result = await Swal.fire({
      title: "Konfirmasi Persetujuan",
      html: `Apakah Anda yakin ingin menyetujui kelompok dengan ketua <b>${nama_ketua}</b>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#14b8a6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Setujui!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      // Show loading screen
      Swal.fire({
        title: "Memproses...",
        html: "Sedang mengirim email penerimaan...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
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

        // Close loading and show success
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Email penerimaan telah dikirim ke kelompok",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchKelompok();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            error.response?.data?.error ||
            "Terjadi kesalahan saat menyetujui kelompok",
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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Tolak!",
      cancelButtonText: "Batal",
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
        confirmButtonColor: "#60a5fa",
        cancelButtonColor: "#94a3b8",
        inputValidator: (value) => {
          if (!value) {
            return "Anda harus menulis alasan penolakan!";
          }
        },
      });

      if (reasonResult.isConfirmed) {
        // Show loading screen
        Swal.fire({
          title: "Memproses...",
          html: "Sedang mengirim email penolakan...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
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

          // Close loading and show success
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Email penolakan telah dikirim ke kelompok",
            timer: 2000,
            showConfirmButton: false,
          });

          fetchKelompok();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text:
              error.response?.data?.error ||
              "Terjadi kesalahan saat menolak kelompok",
          });
        }
      }
    }
  };

  const filteredKelompok = kelompokList.filter(
    (kelompok) =>
      kelompok.instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kelompok.nama_ketua.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kelompok.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex shadow max-w-[95rem] mx-auto">
        <Sidebar />
        <div className="flex-1 ml-[250px] h-screen w-screen">
          <Navbar />
          <div className="p-[100px] flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600/90"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] h-screen w-screen">
        <Navbar />
        <div className="p-[100px]">
          <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            <h1 className="text-blue-600/90 text-3xl font-bold">
              Daftar Kelompok
            </h1>
            <p className="text-sm text-gray-500">
              Total: {kelompokList.length} Kelompok
            </p>

            <div className="my-4 flex items-center justify-center space-x-4">
              <Input
                type="text"
                placeholder="Cari berdasarkan Nama/Email/Institusi"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                px={20}
                className="w-full text-center max-w-lg border border-bg-blue-600/90 rounded-lg"
              />
            </div>

            <div className="flex flex-col min-h-[600px]">
              <div className="flex-grow overflow-auto">
                <table className="w-full border-collapse text-center">
                  <thead className="sticky top-0 bg-blue-600/90 text-white">
                    <tr>
                      <th className="p-2 border border-gray-300">No</th>
                      <th className="p-2 border border-gray-300">Email</th>
                      <th className="p-2 border border-gray-300">Ketua</th>
                      <th className="p-2 border border-gray-300">Institusi</th>
                      <th className="p-2 border border-gray-300">Status</th>
                      <th className="p-2 border border-gray-300">
                        Surat Pengantar
                      </th>
                      <th className="p-2 border border-gray-300">
                        Surat Balasan
                      </th>
                      <th className="p-2 border border-gray-300">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((kelompok, index) => (
                      <tr key={kelompok.id} className="hover:bg-blue-50">
                        <td className="border border-gray-300 p-4 text-sm">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {kelompok.email}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {kelompok.nama_ketua}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {kelompok.instansi}
                        </td>
                        <td className="p-2 border border-gray-300">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              kelompok.status === "Diterima"
                                ? "bg-teal-500 text-white"
                                : kelompok.status === "Ditolak"
                                ? "bg-red-500 text-white"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {kelompok.status}
                          </span>
                        </td>
                        <td className="p-2 border border-gray-300">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() =>
                                handlePreviewDocument(
                                  kelompok.surat_pengantar,
                                  "Surat Pengantar"
                                )
                              }
                              className="bg-white p-2 shadow-lg rounded-lg hover:bg-blue-50"
                            >
                              <Eye className="text-blue-sky" />
                            </button>
                          </div>
                        </td>
                        <td className="p-2 border border-gray-300">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() =>
                                handlePreviewDocument(
                                  kelompok.surat_balasan,
                                  "Surat Balasan"
                                )
                              }
                              className="bg-white p-2 shadow-lg rounded-lg hover:bg-blue-50"
                            >
                              <Eye className="text-oren" />
                            </button>
                          </div>
                        </td>
                        <td className="p-2 border border-gray-300">
                          <div className="flex items-center justify-center space-x-2">
                            {kelompok.status !== "Diterima" &&
                              kelompok.status !== "Ditolak" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleApprove(
                                        kelompok.id,
                                        kelompok.nama_ketua
                                      )
                                    }
                                    className="bg-teal-500 p-2 rounded-lg hover:bg-green-600 transition-colors"
                                    title="Setujui"
                                  >
                                    <Check className="text-white h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleReject(
                                        kelompok.id,
                                        kelompok.nama_ketua
                                      )
                                    }
                                    className="bg-red-500 p-2 rounded-lg hover:bg-red-600 transition-colors"
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

            {/* Modal code remains the same */}
            {selectedFile && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{selectedFile.type}</h2>
                    <button
                      onClick={() => {
                        URL.revokeObjectURL(selectedFile.url);
                        setSelectedFile(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="mb-4 h-[60vh] overflow-hidden">
                    <iframe
                      src={selectedFile.url}
                      className="w-full h-full"
                      title="Document Viewer"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        URL.revokeObjectURL(selectedFile.url);
                        setSelectedFile(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Tutup
                    </button>
                    <button
                      onClick={() =>
                        handleDownloadDocument(
                          selectedFile.originalPath,
                          selectedFile.type
                        )
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Unduh
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

export default Kelompok;
