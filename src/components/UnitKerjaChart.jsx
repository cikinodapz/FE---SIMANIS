import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';

const UnitKerjaChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Modern color palette dengan gradien
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
          fill="#333"
          className="text-lg font-semibold"
        >
          {payload.unitKerja}
        </text>
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fill="#666"
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
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].payload.unitKerja}</p>
          <p className="text-gray-600">Jumlah: {payload[0].value}</p>
          <p className="text-gray-500 text-sm">
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
            className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{ backgroundColor: `${entry.color}20` }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-700">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-center text-2xl font-bold text-gray-800">
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