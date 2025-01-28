import React from "react";
import StatsWithOverlay from "../components/statOverlay.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import { User, Briefcase, Users, Settings } from "lucide-react";

function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-72 w-full">
        <div className="navbar">
          <Navbar label="Selamat Datang" />
        </div>

       
        <div className="max-w-[95rem] mx-auto p-20 mt-10"> 
          <div className="grid grid-cols-4 gap-2">
            {/* Card for Jumlah Peserta */}
            <div className="text-blue-sky">
              <StatsWithOverlay
                label="Jumlah Peserta"
                ikon={Users}
                jumlah="150"
                keterangan="Orang"
                to={"/list-peserta-magang"}
            
              />
            </div>

            {/* Card for Divisi I */}
            <div className="text-green">
              <StatsWithOverlay
                label="Divisi IT"
                ikon={Briefcase}
                jumlah="50"
                keterangan="Orang"
              />
            </div>

            {/* Card for Divisi Umum */}
            <div className="text-orange">
              <StatsWithOverlay
                label="Divisi Umum"
                ikon={User}
                jumlah="40"
                keterangan="Orang"
              />
            </div>

            {/* Card for Divisi Teknikal */}
            <div className="text-purple">
              <StatsWithOverlay
                label="Divisi Teknikal"
                ikon={Settings}
                jumlah="60"
                keterangan="Orang"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
