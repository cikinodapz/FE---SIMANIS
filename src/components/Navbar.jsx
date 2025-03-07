import React, { useState, useEffect, useRef, useContext } from "react";
import { UserIcon, LogOut, Bell, User, Menu, X, Sun, Moon } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { DarkModeContext } from "../context/DarkModeContext"; // Impor context

const Navbar = ({ user }) => {
  const [existingFoto, setExistingFoto] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); // Gunakan context

  const token = localStorage.getItem("accessToken");
  const decodedToken = token ? jwtDecode(token) : null;
  const userRole = decodedToken ? decodedToken.role : null;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let endpoint;
        switch (userRole) {
          case "Admin":
            endpoint = "https://web-baru.up.railway.app/admin/list-notif";
            break;
          case "Pegawai":
            endpoint = "https://web-baru.up.railway.app/pegawai/list-notif";
            break;
          case "User":
            endpoint = "https://web-baru.up.railway.app/peserta/notif-peserta";
            break;
          default:
            return;
        }

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const unreadCount = response.data.data.filter(
          (notif) => !notif.status
        ).length;
        setNotificationCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (
      userRole &&
      (userRole === "Admin" || userRole === "Pegawai" || userRole === "User")
    ) {
      fetchNotifications();
    }
  }, [userRole]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://web-baru.up.railway.app/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let endpoint = "";
        switch (userRole) {
          case "Admin":
            endpoint = "https://web-baru.up.railway.app/admin/profile";
            break;
          case "Pegawai":
            endpoint = "https://web-baru.up.railway.app/pegawai/profile";
            break;
          case "User":
            endpoint = "https://web-baru.up.railway.app/peserta/get-biodata";
            break;
          default:
            return;
        }

        const biodataResponse = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const biodata = biodataResponse.data.data;
        setUserData(biodata);

        if (biodata.foto) {
          let fotoEndpoint;
          if (userRole === "Admin") {
            fotoEndpoint = "https://web-baru.up.railway.app/admin/get-foto-pegawai";
          } else if (userRole === "Pegawai") {
            fotoEndpoint = "https://web-baru.up.railway.app/pegawai/get-foto-pegawai";
          } else if (userRole === "User") {
            fotoEndpoint = "https://web-baru.up.railway.app/peserta/get-foto";
          } else {
            return;
          }

          const fotoResponse = await axios.get(fotoEndpoint, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          });

          const fotoUrl = URL.createObjectURL(fotoResponse.data);
          setExistingFoto(fotoUrl);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userRole) {
      fetchUserData();
    }

    return () => {
      if (existingFoto) {
        URL.revokeObjectURL(existingFoto);
      }
    };
  }, [userRole]);

  const getNotificationLink = () => {
    switch (userRole) {
      case "Admin":
        return "/notifadmin";
      case "Pegawai":
        return "/notifpegawai";
      case "User":
        return "/notifpeserta";
      default:
        return "#";
    }
  };

  return (
    <div className="navbar w-full px-4 md:px-6 mt-6 md:mt-2">
      <header
        className={`fixed top-0 md:top-2 inset-x-0 mx-4 md:mx-6 rounded-2xl md:rounded-3xl shadow-lg z-40 backdrop-blur-md transition-colors duration-300 overflow-visible ${
          darkMode ? "bg-dark-blue-premier/95" : "bg-blue-premier/95"
        }`}
      >
        <div
          className={`absolute inset-0 rounded-2xl md:rounded-3xl ${
            darkMode
              ? "bg-gradient-to-r from-blue-600/90 to-blue-800/90"
              : "bg-gradient-to-r from-blue-600/90 to-blue-800/90"
          }`}
        />
        <nav className="relative max-w-[95rem] w-full mx-auto px-3 md:px-4 py-3 md:py-3">
          <div className="flex items-center justify-between mt-safe-top">
            {/* Brand Section */}
            <a
              className="group flex items-center gap-x-2 text-xl font-semibold text-white 
                       transition-all duration-500 ease-in-out hover:scale-105 
                       relative overflow-hidden p-2 rounded-2xl md:rounded-3xl
                       hover:bg-white/5 focus:outline-none"
              href={
                userRole === "Peserta" || userRole === "User"
                  ? "/landing"
                  : "/landing"
              }
              aria-label="Brand"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                            translate-x-[-200%] group-hover:translate-x-[200%] 
                            transition-transform duration-700 skew-x-12 rounded-3xl"
              />
              <img
                src="/assets/logo.png"
                alt="Logo"
                className="w-10 md:w-14 h-auto mr-2 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="hidden md:grid grid-rows-2 grid-flow-col gap-0 transition-all duration-500">
                <div className="text-lg md:text-xl font-sans italic font-bold group-hover:text-blue-sky">
                  BADAN PUSAT STATISTIK
                </div>
                <div className="text-lg md:text-xl font-sans italic font-bold group-hover:text-blue-sky">
                  PROVINSI SUMATERA BARAT
                </div>
              </div>
              <div className="md:hidden text-lg font-sans italic font-bold group-hover:text-blue-sky">
                BPS SUMBAR
              </div>
            </a>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {/* Tombol Sun/Moon (Toggle Dark Mode) */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors duration-200"
              >
                {darkMode ? (
                  <Sun className="w-8 h-8 text-dark-oren" />
                ) : (
                  <Moon className="w-8 h-8 text-blue-sky" />
                )}
              </button>

              {/* Notifikasi (Bell) */}
              {(userRole === "Admin" ||
                userRole === "Pegawai" ||
                userRole === "User") && (
                <Link
                  to={getNotificationLink()}
                  className="group relative p-2 hover:bg-white/10 rounded-full transition-all duration-300
               flex items-center justify-center"
                >
                  <div className="relative">
                    <Bell
                      className="h-8 w-8 text-white transition-transform duration-300 
                    group-hover:text-blue-sky"
                    />
                    {notificationCount > 0 && (
                      <div
                        className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full
                        flex items-center justify-center transform
                        group-hover:scale-110 group-hover:bg-blue-400
                        transition-all duration-300"
                      >
                        <span className="text-xs text-white font-bold">
                          {notificationCount > 99 ? "99+" : notificationCount}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              )}

              {/* Dropdown Profil */}
              <div
                className="relative flex items-center gap-2"
                ref={dropdownRef}
              >
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`group flex items-center gap-x-4 text-white px-4 py-2
                 transition-all duration-300 ease-in-out
                 relative overflow-hidden cursor-pointer
                 hover:bg-white/10 backdrop-blur-sm rounded-3xl
                 ${
                   isDropdownOpen ? "bg-white/20" : ""
                 }`}
                >
                  <div className="flex flex-col items-end mr-3">
                    <span className="text-sm md:text-lg font-medium transition-all duration-500 group-hover:text-blue-sky">
                      {userData?.nama || user || "Guest"}
                    </span>
                    <span className="text-xs md:text-sm text-gray-300 transition-all duration-500 group-hover:text-blue-300">
                      {userData?.email || "Anonymous"}
                    </span>
                  </div>
                  <div
                    className="relative w-10 h-10 md:w-[55px] md:h-[55px] rounded-full overflow-hidden
                    ring-2 ring-white/50 group-hover:ring-blue-sky
                    transform transition-all duration-500
                    group-hover:scale-110 group-hover:rotate-6"
                  >
                    {existingFoto ? (
                      <img
                        src={existingFoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-800 flex items-center justify-center">
                        <UserIcon
                          size={28}
                          strokeWidth={1.5}
                          className="text-white/90"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-4 w-56 rounded-2xl bg-white shadow-xl
              border border-gray-100 top-full
              transition-all duration-300 ease-in-out
              ${
                isDropdownOpen
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-4 invisible"
              }
              overflow-hidden z-50`}
                >
                  <div className="py-2">
                    <Link
                      to={userRole === "User" ? "/myprofile" : "/profile"}
                      className="flex items-center w-full px-4 py-3 text-gray-800 
                  hover:bg-gray-100 transition-colors duration-200 group"
                    >
                      <User className="h-5 w-5 mr-3 group-hover:text-blue-sky" />
                      <span className="group-hover:text-blue-sky font-medium">
                        Profile
                      </span>
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-red-900 
                  hover:bg-red-200 transition-colors duration-200 group"
                    >
                      <LogOut className="h-5 w-5 mr-3 group-hover:text-red-700" />
                      <span className="group-hover:text-red-700 font-medium">
                        Logout
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;