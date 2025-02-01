import React from "react";
import { UserIcon, LogOut, Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = ({ user }) => {
  const [existingFoto, setExistingFoto] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Get user role from JWT token
  const token = localStorage.getItem("accessToken");
  const decodedToken = token ? jwtDecode(token) : null;
  const userRole = decodedToken ? decodedToken.role : null;

  // Fetch notification count based on user role
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const endpoint = userRole === "Admin" 
          ? "http://localhost:3000/admin/list-notif"
          : "http://localhost:3000/pegawai/list-notif"; // Assuming there's a pegawai endpoint

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const unreadCount = response.data.data.filter(
          (notif) => !notif.status
        ).length;
        setNotificationCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (userRole && (userRole === "Admin" || userRole === "Pegawai")) {
      fetchNotifications();
    }
  }, [userRole]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user data and photo based on role
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        let endpoint = "";
        
        // Select endpoint based on user role
        switch(userRole) {
          case "Admin":
            endpoint = "http://localhost:3000/admin/get-profile";
            break;
          case "Pegawai":
            endpoint = "http://localhost:3000/pegawai/get-profile";
            break;
          case "User":
          case "Peserta":
            endpoint = "http://localhost:3000/peserta/get-biodata";
            break;
          default:
            return;
        }

        const biodataResponse = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const biodata = biodataResponse.data.data;
        setUserData(biodata);

        if (biodata.foto) {
          const fotoEndpoint = userRole === "Peserta" || userRole === "User"
            ? "http://localhost:3000/peserta/get-foto"
            : "http://localhost:3000/user/get-foto";

          const fotoResponse = await axios.get(fotoEndpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  // Get notification link based on user role
  const getNotificationLink = () => {
    switch(userRole) {
      case "Admin":
        return "/notifadmin";
      case "Pegawai":
        return "/notifpegawai";
      default:
        return "#";
    }
  };

  return (
    <div className="navbar">
      <header className="fixed top-2 left-2 right-2 rounded-3xl shadow-lg z-40 backdrop-blur-md bg-blue-premier/95 overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90 rounded-3xl" />

        <nav className="relative max-w-[95rem] w-full mx-auto px-4 py-3 flex items-center justify-between">
          {/* Brand Section */}
          <a
            className="group flex items-center gap-x-2 text-xl font-semibold text-white 
                     transition-all duration-500 ease-in-out hover:scale-105 
                     relative overflow-hidden p-2 rounded-3xl
                     hover:bg-white/5 focus:outline-none"
            href={userRole === "Peserta" || userRole === "User" ? "/statistik" : "/dashboard"}
            aria-label="Brand"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                          translate-x-[-200%] group-hover:translate-x-[200%] 
                          transition-transform duration-700 skew-x-12 rounded-3xl" />
            <img
              src="src/assets/logo.png"
              alt="Logo"
              className="w-10 h-auto mr-2 transition-transform duration-500 group-hover:scale-110
                        shadow-md"
            />
            <div className="grid grid-rows-2 grid-flow-col gap-0 transition-all duration-500">
              <div className="text-xl italic font-bold group-hover:text-blue-200">
                BADAN PUSAT STATISTIK
              </div>
              <div className="text-base italic font-bold group-hover:text-blue-200">
                PROVINSI SUMATERA BARAT
              </div>
            </div>
          </a>

          {/* Right Section with Notifications and Profile */}
          <div className="flex items-center gap-4">
            {/* Notification Bell - Only show for Admin and Pegawai */}
            {(userRole === "Admin" || userRole === "Pegawai") && (
              <Link
                to={getNotificationLink()}
                className="group relative p-2 hover:bg-white/10 rounded-full transition-all duration-300
                         flex items-center justify-center"
              >
                <div className="relative">
                  <Bell
                    className="h-10 w-10 text-white transition-transform duration-300 
                              group-hover:text-blue-200 group-hover:scale-110"
                  />
                  {notificationCount > 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full
                                  flex items-center justify-center transform
                                  group-hover:scale-110 group-hover:bg-blue-400
                                  transition-all duration-300">
                      <span className="text-xs text-white font-bold">
                        {notificationCount > 99 ? "99+" : notificationCount}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            )}

            {/* Profile Section */}
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`group flex items-center gap-x-4 text-white px-6 py-2
                           transition-all duration-300 ease-in-out
                           relative overflow-hidden cursor-pointer
                           hover:bg-white/10 backdrop-blur-sm rounded-3xl
                           ${isDropdownOpen ? "bg-white/20" : ""}`}
              >
                <div className="flex flex-col items-end mr-3">
                  <span className="text-lg font-medium transition-all duration-500 group-hover:text-blue-200">
                    {userData?.nama || user || "Guest"}
                  </span>
                  <span className="text-sm text-gray-300 transition-all duration-500 group-hover:text-blue-300">
                    {userData?.email || "Anonymous"}
                  </span>
                </div>

                <div className="relative w-[55px] h-[55px] rounded-full overflow-hidden
                              ring-2 ring-white/50 group-hover:ring-blue-300
                              transform transition-all duration-500
                              group-hover:scale-110 group-hover:rotate-6">
                  {existingFoto ? (
                    <img
                      src={existingFoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-800 flex items-center justify-center">
                      <UserIcon
                        size={35}
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
                           border border-gray-100
                           transition-all duration-300 ease-in-out
                           ${isDropdownOpen
                             ? "opacity-100 translate-y-0 visible"
                             : "opacity-0 -translate-y-4 invisible"
                           }
                           overflow-hidden z-50`}
              >
                <div className="py-2">
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
        </nav>
      </header>
    </div>
  );
};

export default Navbar;