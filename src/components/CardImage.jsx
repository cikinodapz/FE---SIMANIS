import { Edit2, Trash2, Eye, Check } from "lucide-react";
import Button from "./Button";

const CardImage = ({ image, label, onDelete }) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="w-full h-48 overflow-hidden rounded-t-xl">
        {image}
      </div>

      <div className="p-5">
        {label}
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200">
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>

            <button 
              onClick={onDelete}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all duration-200">
            <Check className="w-4 h-4" />
            <span>Apply Template</span>
          </button>
        </div>

        <button className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>
      </div>
    </div>
  );
};

export default CardImage;