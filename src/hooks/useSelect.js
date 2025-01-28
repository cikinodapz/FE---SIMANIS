import { useCallback } from "react";

const useSelect = () => {
  const getVariantClasses = useCallback((value) => {
    switch (value) {
      case "selesai":
        return "bg-teal-100 text-teal-700 border-teal-500";
      case "terlambat":
        return "bg-red-100 text-red-700 border-red-500";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-500";
      case "aktif":
        return "bg-teal-100 text-teal-700 border-teal-500";
        case "nonAktif":
            return "bg-red-100 text-red-700 border-red-500";
      
      
      default:
        return "bg-white border-gray-300 text-black";
    }
  }, []);

  return { getVariantClasses };
};

export default useSelect;
