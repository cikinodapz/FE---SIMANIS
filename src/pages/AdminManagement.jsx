import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Popup from "./popUp/Admin";
import { Plus, Trash2, Pencil } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";


const AdminManagement = () => {
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
  
  // Pagination states
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

  // Update total pages when filtered data changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredPegawai.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filteredPegawai.length, itemsPerPage]);

  // Get current items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPegawai.slice(indexOfFirstItem, indexOfLastItem);

  const showLoadingAlert = () => {
    Swal.fire({
      title: 'Loading...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  };

  const fetchPegawaiList = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:3000/admin/list-akun",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        icon: 'error',
        title: 'Oops...',
        text: 'Terjadi kesalahan saat mengambil data',
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
      showLoadingAlert();

      if (editPegawai) {
        // Update pegawai
        await axios.put(
          `http://localhost:3000/admin/edit-akun/${editPegawai.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data pegawai berhasil diperbarui',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        // Tambah pegawai baru
        await axios.post(
          "http://localhost:3000/admin/tambah-akun",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Pegawai baru berhasil ditambahkan',
          timer: 1500,
          showConfirmButton: false
        });
      }

      // Refresh data
      fetchPegawaiList();
      
      // Reset form
      setFormData({ nama: "", email: "", nip: "", jabatan: "", role: "Pegawai", password: "" });
      setIsPopupVisible(false);
      setEditPegawai(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data',
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
      title: 'Apakah anda yakin?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          showLoadingAlert();
          
          const token = localStorage.getItem("accessToken");
          await axios.delete(
            `http://localhost:3000/admin/hapus-akun/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: 'Data pegawai berhasil dihapus.',
            timer: 1500,
            showConfirmButton: false
          });

          fetchPegawaiList();
        } catch (error) {
          console.error("Error deleting pegawai:", error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response?.data?.message || 'Terjadi kesalahan saat menghapus data',
          });
        }
      }
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] mx-auto h-screen">
        <Navbar />
        <div className="p-[100px]">
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

          <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-blue-600/90 text-3xl font-bold">Daftar Pegawai</h1>
                <p className="text-sm text-gray-500">Total: {pegawaiList.length} Pegawai</p>
              </div>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="Cari pegawai..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-blue-600/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  label={"Pegawai"}
                  variant="blue"
                  ikon={<Plus />}
                  onClick={() => setIsPopupVisible(true)}
                />
              </div>
            </div>

            <div className="flex flex-col min-h-[600px]">
              <div className="flex-grow overflow-auto">
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-600/90 text-white">
                      <th className="border border-gray-300 p-2 text-center">No</th>
                      <th className="border border-gray-300 p-2 text-center">Nama</th>
                      <th className="border border-gray-300 p-2 text-center">Email</th>
                      <th className="border border-gray-300 p-2 text-center">NIP</th>
                      <th className="border border-gray-300 p-2 text-center">Jabatan</th>
                      <th className="border border-gray-300 p-2 text-center">Role</th>
                      <th className="border border-gray-300 p-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((pegawai, index) => (
                      <tr key={pegawai.id} className="text-center hover:bg-blue-50">
                        <td className="border border-gray-300 p-2">{indexOfFirstItem + index + 1}</td>
                        <td className="border border-gray-300 p-2">{pegawai.nama}</td>
                        <td className="border border-gray-300 p-2">{pegawai.email}</td>
                        <td className="border border-gray-300 p-2">{pegawai.nip}</td>
                        <td className="border border-gray-300 p-2">{pegawai.jabatan}</td>
                        <td className="border border-gray-300 p-2">{pegawai.role}</td>
                        <td className="border border-gray-300 p-2 flex items-center justify-center space-x-4">
                          <div className="p-2 rounded-lg bg-white shadow-lg bg-yellow-50">
                            <Pencil
                              onClick={() => handleEditPegawai(pegawai)}
                              className="text-yellow-600 hover:underline focus:outline-none cursor-pointer"
                            />
                          </div>
                          <div className="p-2 rounded-lg bg-red-100 shadow-lg">
                            <Trash2
                              onClick={() => handleDeletePegawai(pegawai.id)}
                              className="text-red-500 hover:underline focus:outline-none cursor-pointer"
                            />
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
                        return <span key={pageNumber} className="px-2 py-1">...</span>;
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
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;