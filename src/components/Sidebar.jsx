import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  LogOut,
  ClipboardList,
  Users,
  Briefcase,
  Archive,
  ChartColumnBig,
  Settings,
  Award,
  IdCard,
  User,
  FileText,
  BarChart3,
  Bell,
  Mail,
  NotebookText,
  UserCircle,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const decodedToken = token ? jwtDecode(token) : null;
  const userRole = decodedToken ? decodedToken.role : null;

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      } else {
        alert("Gagal logout. Silakan coba lagi.");
      }
    }
  };

  const adminMenuItems = [
    { title: "Dashboard", icon: ChartColumnBig, route: "/dashboard" },
    { title: "Kelompok", icon: ClipboardList, route: "/list-pendaftar" },
    { title: "Peserta", icon: Users, route: "/list-peserta-magang" },
    { title: "Penugasan", icon: Briefcase, route: "/form-tugas" },
    { title: "Logbook", icon: NotebookText, route: "/logbook-peserta" },
    { title: "Template Sertifikat", icon: FileText, route: "/sertifikat" },
    { title: "Profile", icon: UserCircle, route: "/profile" },
    { title: "Pengelolaan Akun", icon: Settings, route: "/admin-management" },
    { title: "Inbox", icon: Mail, route: "/notifadmin" },
    { title: "Logout", icon: LogOut, route: "/login", onClick: handleLogout },
  ];

  const pesertaMenuItems = [
    { title: "Statistik", icon: BarChart3, route: "/statistik" },
    { title: "Profile", icon: UserCircle, route: "/myprofile" },
    { title: "Biodata", icon: User, route: "/biodata" },
    { title: "Tugas", icon: ClipboardList, route: "/daftarTugas" },
    { title: "Logbook", icon: NotebookText, route: "/logbookPeserta" },
    { title: "Sertifikat", icon: Award, route: "/sertifikatPeserta" },
    { title: "Inbox", icon: Mail, route: "/notifpeserta" },
    { title: "Logout", icon: LogOut, route: "/login", onClick: handleLogout },
  ];

  const pegawaiMenuItems = [
    { title: "Profile", icon: UserCircle, route: "/profile" },
    { title: "Penugasan", icon: Briefcase, route: "/form-tugas-pegawai" },
    { title: "Inbox", icon: Mail, route: "/notifpegawai" },
    { title: "Logout", icon: LogOut, route: "/login", onClick: handleLogout },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case "Admin":
        return adminMenuItems;
      case "User":
        return pesertaMenuItems;
      case "Pegawai":
        return pegawaiMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed top-28 left-4 h-screen w-72 flex flex-col pl-2 z-30 pb-32">
        <div className="relative h-full backdrop-blur-md bg-white/30 rounded-[40px] shadow-2xl border border-white/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30 pointer-events-none rounded-[40px]" />

          <div className="h-full overflow-y-auto p-6 mt-5 flex-grow relative z-10">
            <nav>
              <ul className="space-y-3">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.route;

                  return (
                    <li key={index} className="group">
                      <a
                        href={item.route}
                        onClick={(e) => {
                          e.preventDefault();
                          if (item.onClick) {
                            item.onClick();
                          } else {
                            navigate(item.route);
                          }
                        }}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ease-in-out
                          relative overflow-hidden transform
                          ${
                            isActive
                              ? "bg-blue-600/90 text-white shadow-lg shadow-blue-500/30 scale-105 border border-white/30"
                              : "text-gray-700 hover:bg-white/80 hover:shadow-lg hover:scale-105 border border-transparent"
                          }
                          before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                          before:translate-x-[-200%] before:transition-transform before:duration-700
                          hover:before:translate-x-[200%] before:skew-x-12
                          group-hover:border-blue-200/50`}
                      >
                        <Icon
                          className={`w-5 h-5 transition-all duration-500 ease-in-out
                          ${isActive ? "rotate-6" : ""}
                          group-hover:scale-110 group-hover:rotate-6
                          ${!isActive && "group-hover:text-blue-600"}
                        `}
                        />
                        <span
                          className={`font-medium transition-all duration-500
                          ${
                            !isActive &&
                            "group-hover:text-blue-600 group-hover:translate-x-1"
                          }
                        `}
                        >
                          {item.title}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-24 right-4 z-50 p-2 rounded-lg bg-blue-600 text-white"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl transition-transform duration-300 transform ${
            isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="max-h-[70vh] overflow-y-auto p-4">
            <nav>
              <ul className="grid grid-cols-3 gap-4">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.route;

                  return (
                    <li key={index}>
                      <a
                        href={item.route}
                        onClick={(e) => {
                          e.preventDefault();
                          if (item.onClick) {
                            item.onClick();
                          } else {
                            navigate(item.route);
                          }
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all
                          ${
                            isActive
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        <Icon className="w-6 h-6 mb-2" />
                        <span className="text-xs text-center">
                          {item.title}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
