import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { School, Earth, GraduationCap } from 'lucide-react';
import GroupCard from '../components/GroupCard';

const StatisticsSection = () => {
  const [stats, setStats] = useState({
    total_instansi: 0,
    total_peserta: 0,
    total_jurusan: 0
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/publik-statistik');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStats({
          total_instansi: data.data.total_instansi,
          total_peserta: data.data.total_peserta,
          total_jurusan: data.data.total_jurusan
        });
      } catch (err) {
        console.error('Error fetching statistics:', err);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <motion.section
      id="statistik"
      className="relative -to-r from-blue-600/90 to-blue-800/90 flex justify-center gap-0 py-10 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-20 w-full max-w-6xl relative">
        <GroupCard
          judul="Institusi"
          jumlah={stats.total_instansi}
          Ikon={School}
          jumlahColor="text-white"
        />
        <GroupCard
          judul="Bidang"
          jumlah={stats.total_jurusan}
          Ikon={Earth}
          jumlahColor="text-white"
        />
        <GroupCard
          judul="Peserta"
          jumlah={stats.total_peserta}
          Ikon={GraduationCap}
          jumlahColor="text-white"
        />
      </div>
    </motion.section>
  );
};

export default StatisticsSection;