import React, { useEffect, useState, useContext } from "react";
import StatsWithOverlay from "../components/statOverlay.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import {
  Users,
  Briefcase,
  UserCheck,
  UserX,
  ListCheck,
  ListChecks,
  PieChart,
  BarChart,
} from "lucide-react";
import axios from "axios";
import UnitKerjaPieChart from "../components/UnitKerjaChart.jsx";
import { DarkModeContext } from "../context/DarkModeContext";

function Dashboard() {
  const [unitKerjaStats, setUnitKerjaStats] = useState([]);
  const [totalPesertaTahunIni, setTotalPesertaTahunIni] = useState(0);
  const [totalDivisi, setTotalDivisi] = useState(0);
  const [pesertaAktif, setPesertaAktif] = useState(0);
  const [pesertaNonaktif, setPesertaNonaktif] = useState(0);
  const [yearlyRegistrations, setYearlyRegistrations] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { darkMode } = useContext(DarkModeContext);

  const fetchUnitKerjaStatistics = async (year = selectedYear) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://web-baru.up.railway.app/admin/unit-kerja-statistics?year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.data) {
        setUnitKerjaStats(response.data.data.statistics);
        setTotalPesertaTahunIni(response.data.data.totalPesertaTahunIni);
        setTotalDivisi(response.data.data.totalDivisi);
        setPesertaAktif(response.data.data.peserta_aktif);
        setPesertaNonaktif(response.data.data.peserta_nonaktif);
        setYearlyRegistrations(response.data.data.yearlyRegistrations);
      }
    } catch (error) {
      console.error("Error fetching unit kerja statistics:", error);
    }
  };

  useEffect(() => {
    fetchUnitKerjaStatistics();
  }, [selectedYear]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 md:ml-72">
        <Navbar user="Guest" />
        <div className="p-8 lg:p-12 max-w-[95rem] mx-auto mt-16">
          {/* Year Filter */}
          <div className="mb-4 mt-3">
            <div className="flex items-center gap-4">
              <label
                htmlFor="yearFilter"
                className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Filter Tahun:
              </label>
              <select
                id="yearFilter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className={`px-4 py-2 border ${darkMode ? "border-gray-600 bg-gray-700 text-gray-200 focus:ring-blue-400" : "border-gray-300 bg-white text-gray-900 focus:ring-blue-500"} rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300`}
              >
                {yearlyRegistrations.map((year) => (
                  <option key={year.year} value={year.year}>
                    {year.year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5 py-7">
            {/* Kartu Jumlah Peserta */}
            <div
              className={`rounded-xl shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${darkMode ? "bg-gray-800 hover:bg-blue-900/30" : "bg-white hover:bg-blue-50/30"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className={`text-lg font-semibold ${darkMode ? "text-gray-300 group-hover:text-blue-400" : "text-gray-700 group-hover:text-blue-600"} transition-colors duration-300`}
                  >
                    Total Pendaftar
                  </h3>
                  <p className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                    {totalPesertaTahunIni}
                  </p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Pendaftar Tahun {selectedYear}
                  </p>
                </div>
                <div
                  className={`p-3 ${darkMode ? "bg-blue-900 group-hover:bg-blue-800" : "bg-blue-100 group-hover:bg-blue-200"} rounded-full transition-all duration-300`}
                >
                  <BarChart className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                </div>
              </div>
            </div>

            {/* Kartu Total Divisi */}
            <div
              className={`rounded-xl shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${darkMode ? "bg-gray-800 hover:bg-teal-900/30" : "bg-white hover:bg-teal-50/30"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className={`text-lg font-semibold ${darkMode ? "text-gray-300 group-hover:text-teal-400" : "text-gray-700 group-hover:text-teal-600"} transition-colors duration-300`}
                  >
                    Pengalokasian Magang
                  </h3>
                  <p className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                    {totalDivisi}
                  </p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Tempat</p>
                </div>
                <div
                  className={`p-3 ${darkMode ? "bg-yellow-900 group-hover:bg-yellow-800" : "bg-yellow-100 group-hover:bg-yellow-200"} rounded-full transition-all duration-300`}
                >
                  <Briefcase className={`w-6 h-6 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`} />
                </div>
              </div>
            </div>

            {/* Kartu Peserta Aktif */}
            <div
              className={`rounded-xl shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${darkMode ? "bg-gray-800 hover:bg-emerald-900/30" : "bg-white hover:bg-green-50/30"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className={`text-lg font-semibold ${darkMode ? "text-gray-300 group-hover:text-emerald-400" : "text-gray-700 group-hover:text-green-600"} transition-colors duration-300`}
                  >
                    Peserta Aktif
                  </h3>
                  <p className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                    {pesertaAktif}
                  </p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Orang</p>
                </div>
                <div
                  className={`p-3 ${darkMode ? "bg-emerald-900 group-hover:bg-emerald-800" : "bg-emerald-100 group-hover:bg-green-200"} rounded-full transition-all duration-300`}
                >
                  <UserCheck className={`w-6 h-6 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`} />
                </div>
              </div>
            </div>

            {/* Kartu Peserta Nonaktif */}
            <div
              className={`rounded-xl shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${darkMode ? "bg-gray-800 hover:bg-red-900/30" : "bg-white hover:bg-red-50/30"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className={`text-lg font-semibold ${darkMode ? "text-gray-300 group-hover:text-red-400" : "text-gray-700 group-hover:text-red-600"} transition-colors duration-300`}
                  >
                    Peserta Selesai
                  </h3>
                  <p className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                    {pesertaNonaktif}
                  </p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Orang</p>
                </div>
                <div
                  className={`p-3 ${darkMode ? "bg-red-900 group-hover:bg-red-800" : "bg-red-100 group-hover:bg-red-200"} rounded-full transition-all duration-300`}
                >
                  <UserCheck className={`w-6 h-6 ${darkMode ? "text-red-400" : "text-red-600"}`} />
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

            {/* Detail Statistik Section */}
            <div
              className={`rounded-xl shadow-lg p-6 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
            >
              <h2
                className={`text-xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-6`}
              >
                Detail Statistik {selectedYear}
              </h2>
              <div className="space-y-4">
                {unitKerjaStats.map((stat, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"} transition-colors duration-200`}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{
                          backgroundColor: [
                            "#0066FF",
                            "#00FF00",
                            "#FF00FF",
                            "#FFD700",
                            "#B0B0B0",
                          ][index % 5],
                        }}
                      />
                      <span
                        className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {stat.unitKerja}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}
                      >
                        {stat.count}
                      </span>
                      <span className={`ml-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        peserta
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yearly Registration Summary */}
            <div
              className={`mt-8 rounded-xl shadow-lg p-6 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
            >
              <h2
                className={`text-xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-6`}
              >
                Ringkasan Pendaftaran Per Tahun
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {yearlyRegistrations.map((yearStat) => (
                  <div
                    key={yearStat.year}
                    className={`p-4 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"} transition-colors duration-200`}
                  >
                    <p
                      className={`text-lg font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Tahun {yearStat.year}
                    </p>
                    <p
                      className={`text-2xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                    >
                      {yearStat.total}
                    </p>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Pendaftar
                    </p>
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