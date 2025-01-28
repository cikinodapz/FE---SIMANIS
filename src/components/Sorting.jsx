import React, { useEffect } from "react";
import { useSorting } from "../hooks/useSorting";

const Sorting = ({ initialData }) => {
  const { sortedPesertaMagang, sortOrder, setSortOrder, handleSort } = useSorting(initialData);

  useEffect(() => {
    handleSort(sortOrder);
  }, [sortOrder]);

  if (!sortedPesertaMagang || sortedPesertaMagang.length === 0) {
    return <p>Data tidak tersedia.</p>;
  }

  return (
    <div>
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="p-3 border border-gray-300 rounded-md"
      >
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
      </select>

      <ul>
        {sortedPesertaMagang.map((peserta, index) => (
          <li key={index}>
            {peserta.nama} - {peserta.tglDaftar}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sorting;
