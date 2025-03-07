import React, { useState, useEffect, useContext } from "react";
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
import { DarkModeContext } from "../context/DarkModeContext";

const AdminLogbook = () => {
  const { darkMode } = useContext(DarkModeContext);
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
      let url = "https://web-baru.up.railway.app/admin/all-logbooks?";

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
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
      setError(error.response?.data?.message || "Failed to fetch logbooks");
      setLoading(false);
    }
  };

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

  useEffect(() => {
    const total = Math.ceil(sortedLogbooks.length / itemsPerPage);
    setTotalPages(total);
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
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode ? "text-red-400" : "text-red-500"
        }`}
      >
        Error: {error}
      </div>
    );
  }

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) end = 4;
      if (currentPage >= totalPages - 2) start = totalPages - 3;

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (!pageNumbers.includes(totalPages)) pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

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
        <div className="p-8 lg:p-12 mt-20 max-w-7xl mx-auto">
          <div
            className={`shadow-lg p-6 ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
            } rounded-2xl bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm border transition-colors duration-300`}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  Monitoring Logbook
                </h1>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Semua Logbook Peserta
                </p>
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
                  className={`w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-gray-50 border-gray-300 text-gray-800"
                  }`}
                />
                <Search
                  className={`absolute left-3 top-2.5 h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-blue-300 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <Filter size={20} />
                Filter
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Unit Kerja
                    </label>
                    <select
                      value={selectedUnitKerja}
                      onChange={(e) => setSelectedUnitKerja(e.target.value)}
                      className={`w-full p-2 border rounded-lg ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                    >
                      <option value="">Semua Unit</option>
                      <option value="IT">IT</option>
                      <option value="Umum">Umum</option>
                      <option value="Teknis">Teknis</option>
                      <option value="Diseminasi">Diseminasi</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
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
                        className={`w-full p-2 border rounded-lg ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200"
                            : "bg-white border-gray-300 text-gray-800"
                        }`}
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
                        className={`w-full p-2 border rounded-lg ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200"
                            : "bg-white border-gray-300 text-gray-800"
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Urutan
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className={`w-full p-2 border rounded-lg ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                    >
                      <option value="newest">Terbaru</option>
                      <option value="oldest">Terlama</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                      darkMode
                        ? "text-gray-300 bg-gray-600 border-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                        : "text-gray-600 bg-gray-200 border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                    }`}
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            )}

            {/* Table Component */}
            <div className="overflow-x-auto">
              <table
                className={`w-full border-collapse ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <thead
                  className={`${
                    darkMode ? "bg-blue-600/90" : "bg-blue-600/90"
                  } text-white`}
                >
                  <tr>
                    <th className="p-2 text-left">Tanggal</th>
                    <th className="p-2 text-left">Nama Peserta</th>
                    <th className="p-2 text-left">Unit Kerja</th>
                    <th className="p-2 text-left">Kegiatan</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((logbook) => (
                    <tr
                      key={logbook.id}
                      className={`${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"
                      }`}
                    >
                      <td className="p-2">{formatDate(logbook.tanggal)}</td>
                      <td className="p-2">{logbook.peserta.nama}</td>
                      <td className="p-2">{logbook.peserta.unit_kerja}</td>
                      <td className="p-2">{logbook.kegiatan}</td>
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
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                } disabled:opacity-50`}
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
                } disabled:opacity-50`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex gap-1">
                {getPageNumbers().map((pageNumber, index, array) => (
                  <React.Fragment key={pageNumber}>
                    {index > 0 && pageNumber - array[index - 1] > 1 && (
                      <span
                        className={`px-4 py-2 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        ...
                      </span>
                    )}
                    <button
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
                  </React.Fragment>
                ))}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                } disabled:opacity-50`}
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
                } disabled:opacity-50`}
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
  );
};

export default AdminLogbook;