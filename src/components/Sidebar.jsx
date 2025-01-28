import React from "react";
import { useLocation } from "react-router-dom";
import {
  LogOut,
  ClipboardList,
  Users,
  Briefcase,
  Archive,
  ChartColumnBig,
  Settings,
  ShieldCheck,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation(); // Get the current location

  const menuItems = [
    { title: "Dashboard", icon: ChartColumnBig, route: "/dashboard" }, 
    { title: "Kelompok", icon: ClipboardList, route: "/list-pendaftar" },
    { title: "Peserta", icon: Users, route: "/list-peserta-magang" },
    { title: "Penugasan", icon: Briefcase, route: "/form-tugas" },
    { title: "Sertifikat", icon: ShieldCheck, route: "/sertifikat" }, 
    { title: "Pengelolaan Akun", icon: Settings, route: "/admin-management" }, 
    { title: "Logout", icon: LogOut, route: "/login" }, 

  ];

  return (
    <div className="fixed top-20 left-0 h-screen bg-white shadow-xl w-72 flex flex-col">
      <div className="h-full overflow-y-auto p-4 mt-5 flex-grow">
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.route; // Check if the route is active

              return (
                <li key={index}>
                  <a
                    href={item.route}
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
          onClick={() => alert("Logout clicked")}
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
