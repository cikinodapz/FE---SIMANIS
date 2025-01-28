import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LogOut,
  ClipboardList,
  Users,
  Briefcase,
  Archive,
  ChartColumnBig,
  Settings,
  Award,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Konfigurasi axios untuk mengirim cookies
      const response = await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            // Jika menggunakan access token di header
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      
      if (response.status === 200) {
        // Hapus token dari localStorage
        localStorage.removeItem('accessToken');
        
        // Redirect ke halaman login
        navigate('/login');
      }
    } catch (error) {
      console.error("Logout Error:", error);
      
      // Jika error karena token expired, tetap logout di client
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        alert("Gagal logout. Silakan coba lagi.");
      }
    }
  };

  const menuItems = [
    { title: "Dashboard", icon: ChartColumnBig, route: "/dashboard" }, 
    { title: "Kelompok", icon: ClipboardList, route: "/list-pendaftar" },
    { title: "Peserta", icon: Users, route: "/list-peserta-magang" },
    { title: "Penugasan", icon: Briefcase, route: "/form-tugas" },
    { title: "Template Sertifikat", icon: Award, route: "/sertifikat" },
    { title: "Pengelolaan Akun", icon: Settings, route: "/admin-management" }, 
    { 
      title: "Logout", 
      icon: LogOut, 
      route: "/login",
      onClick: handleLogout
    }
  ];

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
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
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

      {/* Logout Button at the bottom */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full text-left p-3 ml-6 hover:text-blue-premier hover:font-bold text-gray-700 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;