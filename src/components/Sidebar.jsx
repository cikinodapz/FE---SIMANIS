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
  FileText,
  BarChart3,
  Bell,
  Mail
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
    { title: "Inbox", icon: Mail, route: "/notifadmin" },
    { 
      title: "Logout", 
      icon: LogOut, 
      route: "/login",
      onClick: handleLogout
    }
  ];

  const pesertaMenuItems = [
    { title: "Statistik", icon: BarChart3, route: "/statistik" },
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
    { title: "Inbox", icon: Mail, route: "/notifpegawai" },
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
    <div className="fixed top-28 left-0 h-screen w-72 flex flex-col pl-2 z-30 pb-32">
      {/* Mengubah hanya container utama menjadi lebih melengkung */}
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
                        ${isActive 
                          ? "bg-blue-600/90 text-white shadow-lg shadow-blue-500/30 scale-105 border border-white/30" 
                          : "text-gray-700 hover:bg-white/80 hover:shadow-lg hover:scale-105 border border-transparent"
                        }
                        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                        before:translate-x-[-200%] before:transition-transform before:duration-700
                        hover:before:translate-x-[200%] before:skew-x-12
                        group-hover:border-blue-200/50
                        `}
                    >
                      <Icon className={`w-5 h-5 transition-all duration-500 ease-in-out
                        ${isActive ? "rotate-6" : ""}
                        group-hover:scale-110 group-hover:rotate-6
                        ${!isActive && "group-hover:text-blue-600"}
                      `} />
                      <span className={`font-medium transition-all duration-500
                        ${!isActive && "group-hover:text-blue-600 group-hover:translate-x-1"}
                      `}>
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
  );
};

export default Sidebar;