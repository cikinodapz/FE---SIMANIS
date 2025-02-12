import { motion, AnimatePresence } from 'framer-motion';


const Card = ({ title, deskripsi, Ikon, iconColor, isCenter }) => {
  return (
      <motion.div
        className={`transform transition-all duration-500 
          ${isCenter ? 'scale-110 z-10' : 'scale-100 opacity-100'}`}
        whileHover={{ scale: isCenter ? 1.15 : 1.05 }}
        layout
      >
        <div className="flex flex-col items-center bg-white shadow-xl border text-center shadow-sm rounded-3xl p-7">
          <div className={`flex items-center justify-center rounded-full shadow-lg border-2 w-24 h-24 mb-4 ${iconColor}`}>
            {Ikon && <Ikon className={`h-16 w-16 ${iconColor}`} />}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 font-serif">{title}</h3>
          <p className="mt-2 text-gray-5900 font-serif">{deskripsi}</p>
        </div>
      </motion.div>
    );
};

export default Card;     