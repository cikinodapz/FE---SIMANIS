import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';
import { AlertCircle, CheckCircle2, Clock, TrendingUp, ClipboardList, Calendar } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  ChartDataLabels
);

const StatCard = ({ title, value, icon: Icon, description, colorClass, animate = true }) => (
  <motion.div
    initial={animate ? { opacity: 0, y: 20 } : false}
    animate={animate ? { opacity: 1, y: 0 } : false}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-gray-50"
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {value}
        </p>
        {description && (
          <p className={`text-sm mt-2 ${colorClass}`}>{description}</p>
        )}
      </div>
      <div className={`p-4 rounded-full bg-gradient-to-br ${colorClass.includes('green') ? 'from-green-400 to-green-600' : 
                                                           colorClass.includes('blue') ? 'from-blue-600 to-blue-400' : 
                                                           'from-red-400 to-red-600'}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  </motion.div>
);

const TugasStatistic = () => {
  const [statistic, setStatistic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: "'Poppins', sans-serif",
            weight: '600'
          },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets[0];
            return chart.data.labels.map((label, index) => ({
              text: label,
              fillStyle: datasets.backgroundColor[index],
              strokeStyle: datasets.backgroundColor[index],
              lineWidth: 0,
              pointStyle: 'circle',
              hidden: !chart.getDataVisibility(index),
              index: index
            }));
          }
        },
        onClick: (e, legendItem, legend) => {
          const index = legendItem.index;
          const chart = legend.chart;
          if (chart.isDatasetVisible(0)) {
            chart.toggleDataVisibility(index);
            chart.update();
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2D3748',
        bodyColor: '#2D3748',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 8,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return ` ${context.label}: ${percentage}% (${value})`;
          }
        }
      },
      datalabels: {
        color: '#FFFFFF',
        font: {
          weight: 'bold',
          size: 14,
          family: "'Poppins', sans-serif"
        },
        formatter: (value, ctx) => {
          const dataset = ctx.chart.data.datasets[0];
          const sum = dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / sum) * 100).toFixed(1) + '%';
          return percentage;
        },
        anchor: 'center',
        align: 'center',
        offset: 0,
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 0,
        borderRadius: 10,
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    hover: {
      mode: 'nearest',
      intersect: true,
      animationDuration: 200
    }
  };

  useEffect(() => {
    const fetchStatistic = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:3000/peserta/statistik-tugas",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.data) {
          setStatistic(response.data.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching statistic:", error);
        setError("Gagal mengambil statistik tugas");
        setIsLoading(false);
      }
    };

    fetchStatistic();
  }, []);

  const getStatusData = useCallback(() => {
    if (!statistic) return null;
    
    const total = Object.values(statistic.status_summary).reduce((a, b) => a + b, 0);
    return {
      labels: Object.keys(statistic.status_summary).map((label) => {
        const value = statistic.status_summary[label];
        const percentage = ((value / total) * 100).toFixed(1);
        return `${label} (${percentage}%)`;
      }),
      datasets: [{
        data: Object.values(statistic.status_summary),
        backgroundColor: [
          'rgba(52, 211, 153, 1)',// Bright Red
          'rgba(255, 99, 99, 1)',  // Bright Green
          'rgba(255, 221, 51, 1)',    // Bright Yellow
        ],
        hoverBackgroundColor: [
          'rgba(16, 185, 129, 1)',  // Darker Bright Red
           'rgba(255, 69, 69, 1)', // Darker Bright Green
          'rgba(255, 204, 0, 1)',     // Darker Bright Yellow
        ],
        borderWidth: 0,
      }]

    };
  }, [statistic]);

  const getDeadlineData = useCallback(() => {
    if (!statistic) return null;
    
    const total = statistic.deadline_summary.upcoming + statistic.deadline_summary.passed;
    const upcomingPercentage = total === 0 ? 0 : ((statistic.deadline_summary.upcoming / total) * 100).toFixed(1);
    const passedPercentage = total === 0 ? 0 : ((statistic.deadline_summary.passed / total) * 100).toFixed(1);
    
    return {
      labels: [
        `Akan Datang (${upcomingPercentage}%)`,
        `Telah Lewat (${passedPercentage}%)`
      ],
      datasets: [{
        data: [statistic.deadline_summary.upcoming, statistic.deadline_summary.passed],
        backgroundColor: [
          'rgba(255, 221, 51, 1)', // Bright Yellow
          'rgba(255, 99, 99, 1)',  // Bright Red
        ],
        hoverBackgroundColor: [
          'rgba(255, 204, 0, 1)',  // Darker Bright Yellow
          'rgba(255, 69, 69, 1)',  // Darker Bright Red
        ],
        borderWidth: 0,
      }]
    };
  }, [statistic]);

  const getCompletionData = useCallback(() => {
    if (!statistic) return null;
    
    const completed = statistic.completion_rate.completed;
    const total = statistic.completion_rate.total;
    const incomplete = total - completed;
    const completedPercentage = total === 0 ? 0 : ((completed / total) * 100).toFixed(1);
    const incompletePercentage = total === 0 ? 0 : ((incomplete / total) * 100).toFixed(1);
    
    return {
      labels: [
        `Selesai (${completedPercentage}%)`,
        `Belum Selesai (${incompletePercentage}%)`
      ],
      datasets: [{
        data: [completed, incomplete],
        backgroundColor: [
          'rgba(52, 211, 153, 1)', // Bright Green
          'rgba(255, 99, 99, 1)',  // Bright Red
        ],
        hoverBackgroundColor: [
          'rgba(16, 185, 129, 1)', // Darker Bright Green
          'rgba(255, 69, 69, 1)',  // Darker Bright Red
        ],
        borderWidth: 0,
      }]
    };
  }, [statistic]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="mt-4 text-gray-600 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-center font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!statistic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4" />
          <p className="font-medium">Tidak ada data statistik tugas</p>
        </div>
      </div>
    );
  }

  const completionRate = statistic.completion_rate.total === 0 
  ? 0 
  : ((statistic.completion_rate.completed / statistic.completion_rate.total) * 100).toFixed(1);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-72">
        <Navbar user="Guest" />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-8 lg:p-12 max-w-[95rem] mx-auto mt-16"
        >
          <div className="flex items-center justify-between mb-8">
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-bold text-gray-800"
            >
              {/* Dashboard Statistik Tugas */}
            </motion.h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Tingkat Penyelesaian"
              value={`${completionRate}%`}
              icon={CheckCircle2}
              description={`${statistic.completion_rate.completed} dari ${statistic.completion_rate.total} tugas`}
              colorClass="text-blue-600"
            />
            <StatCard
              title="Tugas Akan Datang"
              value={statistic.deadline_summary.upcoming}
              icon={Clock}
              description="Deadline belum terlewati"
              colorClass="text-blue-600"
            />
            <StatCard
              title="Tugas Terlambat"
              value={statistic.deadline_summary.passed}
              icon={AlertCircle}
              description="Deadline telah terlewati"
              colorClass="text-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <ClipboardList className="w-6 h-6 mr-2 text-yellow-500" />
                Status Tugas
              </h2>
              <div className="h-[300px] relative">
                <Doughnut data={getStatusData()} options={chartOptions} />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-blue-500" />
                Deadline Overview
              </h2>
              <div className="h-[300px] relative">
                <Doughnut data={getDeadlineData()} options={chartOptions} />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
                Progress Overview
              </h2>
              <div className="h-[300px] relative">
                <Doughnut data={getCompletionData()} options={chartOptions} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TugasStatistic;