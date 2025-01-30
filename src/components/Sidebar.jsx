import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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
  FileText
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const decodedToken = token ? jwtDecode(token) : null;
  const userRole = decodedToken ? decodedToken.role : null;

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      
      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    } catch (error) {
      console.error("Logout Error:", error);
      
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('accessToken');
        navigate('/login');
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
    { title: "Template Sertifikat", icon: FileText, route: "/sertifikat" },
    { title: "Pengelolaan Akun", icon: Settings, route: "/admin-management" },
    { 
      title: "Logout", 
      icon: LogOut, 
      route: "/login",
      onClick: handleLogout
    }
  ];

  const pesertaMenuItems = [
    { title: "Biodata", icon: User, route: "/biodata" },
    { title: "Tugas", icon: ClipboardList, route: "/daftarTugas" },
    { title: "Sertifikat", icon: Award, route: "/sertifikatPeserta" },
    { 
      title: "Logout", 
      icon: LogOut, 
      route: "/login",
      onClick: handleLogout
    }
  ];

  const pegawaiMenuItems = [
    { title: "Penugasan", icon: Briefcase, route: "/form-tugas-pegawai" },
    { 
      title: "Logout", 
      icon: LogOut, 
      route: "/login",
      onClick: handleLogout
    }
  ];

  const getMenuItems = () => {
    switch(userRole) {
      case "Admin":
        return adminMenuItems;
      case "User":      // Added User role to match the JWT token
      case "Peserta":   // Keep Peserta for backwards compatibility
        return pesertaMenuItems;
      case "Pegawai":
        return pegawaiMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="fixed top-20 left-0 h-screen bg-white shadow-xl w-72 flex flex-col">
      <div className="h-full overflow-y-auto p-4 mt-5 flex-grow">
        <nav>
          <ul className="space-y-2">
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
                    }}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-premier text-white"
                        : "text-gray-700 hover:bg-blue-100 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;