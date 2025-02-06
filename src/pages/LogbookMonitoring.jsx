import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Search, Filter } from "lucide-react";
import Swal from "sweetalert2";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const AdminLogbook = () => {
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedUnitKerja, setSelectedUnitKerja] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchLogbooks();
  }, [selectedUnitKerja, dateRange]);

  const fetchLogbooks = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      let url = "http://localhost:3000/admin/all-logbooks?";

      if (selectedUnitKerja) url += `&unit_kerja=${selectedUnitKerja}`;
      if (dateRange.startDate) url += `&startDate=${dateRange.startDate}`;
      if (dateRange.endDate) url += `&endDate=${dateRange.endDate}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setLogbooks(response.data.data.logbooks || []);
        // Calculate total pages when data is received
        const total = Math.ceil((response.data.data.logbooks || []).length / itemsPerPage);
        setTotalPages(total);
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

  // Filter and Sort Functions
  const filteredLogbooks = logbooks.filter(
    (logbook) =>
      logbook.peserta.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      logbook.kegiatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedLogbooks = [...filteredLogbooks].sort((a, b) => {
    const dateA = new Date(a.tanggal);
    const dateB = new Date(b.tanggal);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Update total pages when filtered/sorted data changes
  useEffect(() => {
    const total = Math.ceil(sortedLogbooks.length / itemsPerPage);
    setTotalPages(total);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [sortedLogbooks.length, itemsPerPage, searchTerm, sortOrder]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedLogbooks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const resetFilters = () => {
    setSelectedUnitKerja("");
    setDateRange({ startDate: "", endDate: "" });
    setSortOrder("newest");
    setSearchTerm("");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of middle pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the start
      if (currentPage <= 3) {
        end = 4;
      }
      
      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Always show last page
      if (!pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] h-screen">
        <Navbar />
        <div className="p-[100px]">
          <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-blue-600/90 text-3xl font-bold">
                  Monitoring Logbook
                </h1>
                <p className="text-sm text-gray-500">Semua Logbook Peserta</p>
              </div>
            </div>

            {/* Search and Filter Toggle */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama/kegiatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-300 rounded-lg hover:bg-gray-300"
              >
                <Filter size={20} />
                Filter
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Unit Kerja
                    </label>
                    <select
                      value={selectedUnitKerja}
                      onChange={(e) => setSelectedUnitKerja(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">Semua Unit</option>
                      <option value="IT">IT</option>
                      <option value="Umum">Umum</option>
                      <option value="Teknis">Teknis</option>
                      <option value="Diseminasi">Diseminasi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Rentang Tanggal
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) =>
                          setDateRange({
                            ...dateRange,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) =>
                          setDateRange({
                            ...dateRange,
                            endDate: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Urutan
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="newest">Terbaru</option>
                      <option value="oldest">Terlama</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300 rounded-lg transition-all duration-300 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            )}

            {/* Table Component */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-blue-600/90 text-white">
                  <tr>
                    <th className="p-2 border text-left">Tanggal</th>
                    <th className="p-2 border text-left">Nama Peserta</th>
                    <th className="p-2 border text-left">Unit Kerja</th>
                    <th className="p-2 border text-left">Kegiatan</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((logbook) => (
                    <tr key={logbook.id} className="hover:bg-blue-50">
                      <td className="p-2 border">
                        {formatDate(logbook.tanggal)}
                      </td>
                      <td className="p-2 border">{logbook.peserta.nama}</td>
                      <td className="p-2 border">
                        {logbook.peserta.unit_kerja}
                      </td>
                      <td className="p-2 border">{logbook.kegiatan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

             {/* Updated Pagination */}
             <div className="mt-4 flex items-center justify-center gap-2">
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

              <div className="flex gap-1">
                {getPageNumbers().map((pageNumber, index, array) => (
                  <React.Fragment key={pageNumber}>
                    {index > 0 && pageNumber - array[index - 1] > 1 && (
                      <span className="px-4 py-2">...</span>
                    )}
                    <button
                      onClick={() => paginate(pageNumber)}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === pageNumber
                          ? "bg-blue-600/90 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  </React.Fragment>
                ))}
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

              <span className="text-sm text-gray-600 ml-4">
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogbook;
