import { Edit, Trash2, Eye } from "lucide-react";
import Button from "./Button";

const CardImage = ({ image, label }) => {
  return (
    <a
      className="flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-lg focus:outline-none focus:shadow-lg transition"
      href="#"
    >
      {/* Membungkus gambar dalam div dengan ukuran tetap */}
      <div className="w-full h-48 overflow-hidden flex justify-center items-center bg-gray-100 rounded-t-xl">
        {image}
      </div>
      <div className="p-4 md:p-5">
        <h3 className="text-lg text-center font-bold text-gray-800">{label}</h3>
        <div className="flex items-center justify-center space-x-3 mt-3">
          <Edit className="w-5 h-5 text-yellow-600 hover:text-yellow-400 cursor-pointer bg-white rounded-lg shadow-lg" />
          <Trash2 className="w-5 h-5 text-red-600 hover:text-red-400 cursor-pointer" />
        </div>
        <div className="mt-5 flex justify-center font-medium">
          <Button variant="teal" label={"Saat ini"} />
        </div>
      </div>
    </a>
  );
};

export default CardImage;
