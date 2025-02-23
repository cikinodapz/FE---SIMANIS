import React, { useState, useContext } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from "recharts";
import { DarkModeContext } from "../context/DarkModeContext"; // Pastikan path ini sesuai

const UnitKerjaChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { darkMode } = useContext(DarkModeContext); // Mengambil status dark mode dari context

  // Modern color palette dengan gradien (tetap sama)
  const COLORS = [
    "#0066FF",    // Biru neon terang untuk Umum
    "#00FF00",    // Hijau neon untuk IT
    "#FF00FF",    // Magenta/Pink neon untuk Diseminasi
    "#FFD700",    // Kuning emas terang untuk Teknikal
    "#B0B0B0",    // Abu-abu lebih terang untuk Tidak Ditentukan
  ];

  // Konfigurasi custom untuk active sector
  const renderActiveShape = (props) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, value
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 20}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 25}
          outerRadius={outerRadius + 28}
          fill={fill}
        />
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill={darkMode ? "#FFFFFF" : "#333"} // Teks putih di mode gelap, hitam di mode terang
          className="text-lg font-semibold"
        >
          {payload.unitKerja}
        </text>
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fill={darkMode ? "#CCCCCC" : "#666"} // Teks abu-abu terang di mode gelap, abu-abu di mode terang
          className="text-base"
        >
          {`Total: ${value}`}
        </text>
      </g>
    );
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 shadow-lg rounded-lg border ${darkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}>
          <p className={`font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>{payload[0].payload.unitKerja}</p>
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>Jumlah: {payload[0].value}</p>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {((payload[0].value / data.reduce((a, b) => a + b.count, 0)) * 100).toFixed(1)}% dari total
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Legend
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className={`flex items-center gap-2 px-3 py-1 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-xl shadow-lg p-6 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
      <div className="mb-6">
        <h2 className={`text-center text-2xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
          Distribusi Unit Kerja
        </h2>
      </div>
      <div className="p-4">
        <div className="w-full h-96">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={85}
                outerRadius={120}
                dataKey="count"
                nameKey="unitKerja"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-300"
                    style={{
                      filter: `drop-shadow(0px 0px 6px ${COLORS[index % COLORS.length]}80)`
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UnitKerjaChart;