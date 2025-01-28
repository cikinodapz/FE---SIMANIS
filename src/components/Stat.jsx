const Stat = ({ jumlah, label, warna }) => {
    return (
      <div className="text-center">
        <p className={`mt-2 sm:mt-3 text-shadow-lg text-7xl sm:text-6xl font-bold ${warna}`}>
          {jumlah}
        </p>
        <p className="mt-1 sm:text-xl font-semibold text-gray-800">{label}</p>
      </div>
    );
  };

export default Stat;
