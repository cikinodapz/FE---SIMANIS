import React, { useEffect, useState } from "react";
import StatsWithOverlay from "../components/statOverlay.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import { Users, Briefcase, UserCheck, UserX } from "lucide-react";
import axios from "axios";
import UnitKerjaPieChart from "../components/UnitKerjaChart.jsx";

function Dashboard() {
  const [unitKerjaStats, setUnitKerjaStats] = useState([]);
  const [totalPeserta, setTotalPeserta] = useState(0);
  const [totalDivisi, setTotalDivisi] = useState(0);
  const [pesertaAktif, setPesertaAktif] = useState(0);
  const [pesertaNonaktif, setPesertaNonaktif] = useState(0);

  const fetchUnitKerjaStatistics = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:3000/admin/unit-kerja-statistics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setUnitKerjaStats(response.data.data.statistics);
        setTotalPeserta(response.data.data.totalPeserta);
        setTotalDivisi(response.data.data.totalDivisi);
        setPesertaAktif(response.data.data.peserta_aktif);
        setPesertaNonaktif(response.data.data.peserta_nonaktif);
      }
    } catch (error) {
      console.error("Error fetching unit kerja statistics:", error);
    }
  };

  useEffect(() => {
    fetchUnitKerjaStatistics();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-72">
        <Navbar user="Guest" />
        <div className="p-8 lg:p-12 max-w-[95rem] mx-auto mt-16">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5 py-7">
            {/* Kartu Total Divisi */}
            <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-teal-50/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 group-hover:text-teal-600 transition-colors duration-300">
                    Total Divisi
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalDivisi}
                  </p>
                  <p className="text-sm text-gray-500">Divisi</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full transition-all duration-300 group-hover:bg-teal-200">
                  <Briefcase className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Kartu Jumlah Peserta */}
            <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-blue-50/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                    Jumlah Peserta
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalPeserta}
                  </p>
                  <p className="text-sm text-gray-500">Orang</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full transition-all duration-300 group-hover:bg-blue-200">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Kartu Peserta Aktif */}
            <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-green-50/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 group-hover:text-green-600 transition-colors duration-300">
                    Peserta Aktif
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {pesertaAktif}
                  </p>
                  <p className="text-sm text-gray-500">Orang</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full transition-all duration-300 group-hover:bg-green-200">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Kartu Peserta Nonaktif */}
            <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-red-50/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 group-hover:text-red-600 transition-colors duration-300">
                    Peserta Nonaktif
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {pesertaNonaktif}
                  </p>
                  <p className="text-sm text-gray-500">Orang</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full transition-all duration-300 group-hover:bg-red-200">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart Section */}
            <div>
              <UnitKerjaPieChart data={unitKerjaStats} />
            </div>

            {/* Additional Stats or Info Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Detail Statistik
              </h2>
              <div className="space-y-4">
                {unitKerjaStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{
                          backgroundColor: [
                              "#0066FF",    // Biru neon terang (menggantikan #4158D0)
                              "#00FF00",    // Hijau neon terang (menggantikan #38ef7d)
                              "#FF00FF",    // Pink/Magenta neon (menggantikan #C850C0)
                              "#FFD700",    // Kuning emas terang (menggantikan #FFCC70)
                              "#B0B0B0",    // Abu-abu lebih terang (menggantikan #808080)
                          ][index % 5],
                      }}
                      />
                      <span className="font-medium text-gray-700">
                        {stat.unitKerja}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900 font-semibold">
                        {stat.count}
                      </span>
                      <span className="text-gray-500 ml-1">peserta</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;