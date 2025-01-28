import { useState } from "react";

export const useSorting = (initialData = []) => {
  const [sortedPesertaMagang, setSortedPesertaMagang] = useState(initialData);
  const [sortOrder, setSortOrder] = useState("newest");

  const handleSort = (order) => {
    const sorted = [...sortedPesertaMagang].sort((a, b) => {
      if (order === "newest") return new Date(b.tglDaftar) - new Date(a.tglDaftar);
      if (order === "oldest") return new Date(a.tglDaftar) - new Date(b.tglDaftar);
      return 0;
    });
    setSortedPesertaMagang(sorted);
  };

  return { sortedPesertaMagang, sortOrder, setSortOrder, handleSort };
};
