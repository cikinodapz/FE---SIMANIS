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
import { AlertCircle, CheckCircle2, Clock, TrendingUp, ClipboardList } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Title, Tooltip, Legend, LinearScale, ChartDataLabels);

const StatCard = ({ title, value, icon: Icon, description, colorClass }) => (
  <motion.div
    whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
    whileTap={{ scale: 0.98 }}
    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 bg-opacity-90 dark:bg-opacity-95 backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300"
  >
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-tight">{title}</h3>
        <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {value}
        </p>
        <p className={`text-sm ${colorClass} font-medium dark:text-opacity-90`}>{description}</p>
      </div>
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClass.includes('green') ? 'from-emerald-500 to-teal-600' : 
        colorClass.includes('blue') ? 'from-indigo-500 to-blue-600' : 'from-rose-500 to-pink-600'} 
        shadow-md transform rotate-6`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  </motion.div>
);

const TugasStatistic = () => {
  const [statistic, setStatistic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // Default ke false (light mode)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode);
      document.documentElement.classList.toggle('dark');
      return newMode;
    });
  };

  useEffect(() => {
    // Pastikan light mode sebagai default saat halaman dimuat
    const savedMode = localStorage.getItem('darkMode');
    const isDark = savedMode === 'true'; // Hanya true jika eksplisit disimpan sebagai true
    setDarkMode(isDark);

    // Terapkan class 'dark' hanya jika savedMode adalah true
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark'); // Pastikan light mode default
    }

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
        setStatistic(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching statistic:", error);
        setError("Failed to load task statistics");
        setIsLoading(false);
      }
    };
    fetchStatistic();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: window.innerWidth < 768 ? 15 : 25,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: window.innerWidth < 768 ? 12 : 14,
            family: "'Inter', sans-serif",
            weight: '600'
          },
          color: darkMode ? '#E2E8F0' : '#2D3748', // Warna dinamis
          boxWidth: 10,
          boxHeight: 10,
        }
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(45, 55, 72, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: darkMode ? '#E2E8F0' : '#1A202C',
        bodyColor: darkMode ? '#CBD5E0' : '#4A5568',
        borderColor: darkMode ? '#4A5568' : '#E2E8F0',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      },
      datalabels: {
        color: '#FFFFFF',
        font: {
          weight: '700',
          size: window.innerWidth < 768 ? 12 : 16,
          family: "'Inter', sans-serif"
        },
        formatter: (value, ctx) => {
          const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          return value === 0 ? '' : `${((value / total) * 100).toFixed(1)}%`;
        },
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }
    },
    elements: {
      arc: {
        borderWidth: 0,
        borderRadius: 12,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowBlur: 10,
        shadowColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1200,
      easing: 'easeOutCubic'
    }
  };

  const getStatusData = useCallback(() => {
    if (!statistic) return null;
    return {
      labels: Object.keys(statistic.status_summary),
      datasets: [{
        data: Object.values(statistic.status_summary),
        backgroundColor: ['#34D399', '#F87171', '#FBBF24'],
        hoverBackgroundColor: ['#2DD4BF', '#FCA5A5', '#FCD34D'],
        borderWidth: 0,
        shadowOffsetY: 6,
        shadowBlur: 12,
      }]
    };
  }, [statistic]);

  const getDeadlineData = useCallback(() => {
    if (!statistic) return null;
    return {
      labels: ['Upcoming', 'Overdue'],
      datasets: [{
        data: [statistic.deadline_summary.upcoming, statistic.deadline_summary.passed],
        backgroundColor: ['#FBBF24', '#F87171'],
        hoverBackgroundColor: ['#FCD34D', '#FCA5A5'],
        borderWidth: 0,
      }]
    };
  }, [statistic]);

  const getCompletionData = useCallback(() => {
    if (!statistic) return null;
    const completed = statistic.completion_rate.completed;
    const total = statistic.completion_rate.total;
    return {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [completed, total - completed],
        backgroundColor: ['#34D399', '#F87171'],
        hoverBackgroundColor: ['#2DD4BF', '#FCA5A5'],
        borderWidth: 0,
      }]
    };
  }, [statistic]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-indigo-600 border-gray-200 dark:border-t-indigo-400 dark:border-gray-700 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-red-100 dark:border-red-900"
        >
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <p className="text-rose-600 dark:text-rose-400 font-medium text-center">{error}</p>
        </motion.div>
      </div>
    );
  }

  const completionRate = statistic.completion_rate.total === 0 
    ? 0 
    : ((statistic.completion_rate.completed / statistic.completion_rate.total) * 100).toFixed(1);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 md:ml-72">
        <Navbar user="Guest" toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 lg:p-12 max-w-7xl mx-auto mt-20"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            {/* Task Dashboard */}
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <StatCard
              title="Completion Rate"
              value={`${completionRate}%`}
              icon={CheckCircle2}
              description={`${statistic.completion_rate.completed}/${statistic.completion_rate.total} tasks`}
              colorClass="text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              title="Upcoming Tasks"
              value={statistic.deadline_summary.upcoming}
              icon={Clock}
              description="Due soon"
              colorClass="text-indigo-600 dark:text-indigo-400"
            />
            <StatCard
              title="Overdue Tasks"
              value={statistic.deadline_summary.passed}
              icon={AlertCircle}
              description="Past deadline"
              colorClass="text-rose-600 dark:text-rose-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { title: "Completion Progress", icon: TrendingUp, data: getCompletionData(), color: "text-emerald-500 dark:text-emerald-400" },
              { title: "Task Status", icon: ClipboardList, data: getStatusData(), color: "text-amber-500 dark:text-amber-400" },
              { title: "Deadline Status", icon: Clock, data: getDeadlineData(), color: "text-indigo-500 dark:text-indigo-400" },
            ].map((chart, index) => (
              <motion.div
                key={chart.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 bg-opacity-95 backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                  <chart.icon className={`w-6 h-6 mr-2 ${chart.color}`} />
                  {chart.title}
                </h2>
                <div className="h-[300px] relative">
                  <Doughnut data={chart.data} options={chartOptions} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default TugasStatistic;