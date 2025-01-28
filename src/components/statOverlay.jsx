import useNavigateTo from "../hooks/useStat";

const StatsWithOverlay = ({ label, jumlah, ikon: Ikon, keterangan, to }) => {
  const navigateTo = useNavigateTo();

  const handleNavigate = () => {
    navigateTo(to);
  };

  return (
    <div
      className="p-4 bg-gradient-to-r from-blue-100 via-blue-100 to-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-100 ease-in-out transform hover:-translate-y-2 hover:z-10"
    >
      <div
        onClick={handleNavigate}
        className="flex items-center justify-between"
      >
        <div>
          <div className="text-sm font-medium text-gray-500">{label}</div>
          <div className="flex items-baseline mt-2">
            <div className="text-3xl font-bold text-black">{jumlah}</div>
            <div className="ml-3 text-sm font-semibold text-gray-600">{keterangan}</div>
          </div>
        </div>
        <div className="flex items-center justify-center bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-full h-12 w-12">
          {Ikon && <Ikon className="h-6 w-6" />}
        </div>
      </div>
    </div>
  );
};

export default StatsWithOverlay;
