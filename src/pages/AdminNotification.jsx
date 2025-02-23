import React, { useState, useEffect, useContext } from 'react'; // Tambah useContext
import { Bell, Search, CheckCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import Swal from "sweetalert2";
import { DarkModeContext } from "../context/DarkModeContext"; // Import DarkModeContext

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Tambah DarkModeContext
  const { darkMode } = useContext(DarkModeContext);

  // Pagination functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:3000/admin/list-notif", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Gagal mengambil notifikasi");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:3000/admin/mark-one/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === notificationId
            ? { ...notif, status: true }
            : notif
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'Notifikasi telah dibaca',
        showConfirmButton: false,
        timer: 1500,
        position: 'top-end',
        toast: true
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal menandai notifikasi sebagai sudah dibaca',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter notifications based on search
  const filteredNotifications = notifications.filter((notif) =>
    notif.pesan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update total pages when filtered data changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredNotifications.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filteredNotifications.length, itemsPerPage]);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-96 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-indigo-900' : 'bg-gradient-to-br from-gray-50 to-indigo-50'} transition-colors duration-300`}>
      <Sidebar />
      <div className="flex-1 md:ml-[250px]">
        <Navbar />
        <div className="p-8 lg:p-12 mt-20 max-w-7xl mx-auto">
          <div className={`rounded-lg shadow-lg  ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border transition-colors duration-300`}>
            {/* Header */}
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <div>
                  <h1 className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Notifikasi
                  </h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Kelola semua notifikasi sistem
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="p-6">
              <div className="mb-6">
                <div className="relative">
                  <Search className={`absolute left-3 top-3 h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Cari notifikasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 w-full max-w-md border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200 focus:border-blue-400' : 'border-gray-300 bg-white text-gray-800 focus:border-blue-500'} transition-colors`}
                  />
                </div>
              </div>

              {/* Content */}
              {error ? (
                <div className={`p-4 rounded ${darkMode ? 'bg-red-900 border-red-700 text-red-300' : 'bg-red-50 border-l-4 border-red-500 text-red-700'}`}>
                  <p>{error}</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className={`rounded-full p-6 mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Bell className={`h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Tidak Ada Notifikasi
                  </h3>
                  <p className={`text-center max-w-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Saat ini belum ada notifikasi yang tersedia.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col min-h-[600px]">
                  <div className="flex-grow space-y-4">
                    {currentItems.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex items-start justify-between p-4 rounded-lg hover:shadow-md transition-shadow border ${
                          notif.status 
                            ? darkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'
                            : darkMode ? 'bg-blue-900 border-blue-400 text-gray-200' : 'bg-blue-50 border-2 border-blue-500 text-gray-900'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {!notif.status && (
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${darkMode ? 'bg-blue-700 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                                Baru
                              </span>
                            )}
                            <p className={`${notif.status ? '' : 'font-semibold'}`}>
                              {notif.pesan}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatDate(notif.createdAt)}
                            </span>
                            {notif.status && (
                              <span className={`text-sm flex items-center gap-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                <CheckCircle className="h-4 w-4" /> Sudah dibaca
                              </span>
                            )}
                          </div>
                        </div>
                        {!notif.status && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className={`p-2 rounded-full transition-colors ${darkMode ? 'text-blue-400 hover:bg-blue-800 hover:text-blue-200' : 'text-blue-600 hover:bg-blue-100 hover:text-blue-800'}`}
                            title="Tandai sudah dibaca"
                          >
                            <CheckCircle className="h-7 w-7" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <div className={`mt-auto pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                      >
                        <ChevronsLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
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
                                    ? darkMode ? 'bg-blue-500 text-white' : 'bg-blue-600/90 text-white'
                                    : darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600'
                                } transition-colors`}
                              >
                                {pageNumber}
                              </button>
                            );
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return <span key={pageNumber} className={`px-2 py-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <button
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                      >
                        <ChevronsRight className="h-5 w-5" />
                      </button>

                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-4`}>
                        Halaman {currentPage} dari {totalPages}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;