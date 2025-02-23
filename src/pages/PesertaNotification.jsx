import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import {
  Bell,
  Search,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { DarkModeContext } from "../context/DarkModeContext";

const PesertaNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const { darkMode } = useContext(DarkModeContext);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:3000/peserta/notif-peserta", {
        headers: { Authorization: `Bearer ${token}` },
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
        `http://localhost:3000/peserta/mark-one/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, status: true } : notif
        )
      );

      Swal.fire({
        icon: "success",
        title: "Notifikasi telah dibaca",
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
        toast: true,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menandai notifikasi sebagai sudah dibaca",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((notif) =>
    notif.pesan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredNotifications.length / itemsPerPage));
    setCurrentPage(1);
  }, [filteredNotifications.length, itemsPerPage]);

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
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 md:ml-[250px]">
        <Navbar />
        <div className="p-8 lg:p-12 mt-20 max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm transition-colors duration-300">
            {/* Header */}
            <div className="p-9 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Notifikasi</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Kelola semua notifikasi sistem</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="p-6">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Cari notifikasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full max-w-md border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  />
                </div>
              </div>

              {/* Content */}
              {error ? (
                <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 p-4 rounded text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-4">
                    <Bell className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Tidak Ada Notifikasi
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                    Saat ini belum ada notifikasi yang tersedia.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col min-h-[600px]">
                  <div className="flex-grow space-y-4">
                    {currentItems.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex items-start justify-between p-4 rounded-lg hover:shadow-md transition-shadow ${
                          notif.status
                            ? "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                            : "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {!notif.status && (
                              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                                Baru
                              </span>
                            )}
                            <p
                              className={`${
                                notif.status
                                  ? "text-gray-500 dark:text-gray-400"
                                  : "text-gray-900 dark:text-gray-100 font-semibold"
                              }`}
                            >
                              {notif.pesan}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(notif.createdAt)}
                            </span>
                            {notif.status && (
                              <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" /> Sudah dibaca
                              </span>
                            )}
                          </div>
                        </div>
                        {!notif.status && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            title="Tandai sudah dibaca"
                          >
                            <CheckCircle className="h-7 w-7" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="First page"
                      >
                        <ChevronsLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
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
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Last page"
                      >
                        <ChevronsRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-4">
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

export default PesertaNotification;