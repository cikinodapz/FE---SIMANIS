import useCountUp from '../hooks/useCountUp';

const Card = ({ title, deskripsi, textColor, Ikon }) => {
  const count = useCountUp(parseInt(title, 10)); // Menggunakan custom hook untuk animasi angka

  return (
    <div
      className="flex flex-col bg-white border shadow-lg rounded-xl transition-transform duration-300 ease-in-out items-center justify-center h-full hover:scale-105 active:scale-95"
    >
      <div className="p-10 md:p-10 flex flex-col items-center justify-center mt-5 mb-5">
        <div className="flex items-center justify-center rounded-full shadow-lg border-2 border-blue-500 w-24 h-24 mb-4">
          {Ikon && <Ikon className="h-16 w-16" />}
        </div>

        <h3 className={`text-8xl font-bold text-center text-shadow-lg ${textColor}`}>
          {count}
        </h3>

        <p className="mt-5 text-blue-premier text-center text-3xl font-bold">{deskripsi}</p>
      </div>
    </div>
  );
};

export default Card;
