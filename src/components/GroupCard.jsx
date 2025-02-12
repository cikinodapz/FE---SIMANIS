import React from "react";
import useCounterAnimation from "../hooks/useCounterAnimation";

const GroupCard = ({ judul, jumlah, Ikon, jumlahColor = 'text-blue-600' }) => {
  const counter = useCounterAnimation(jumlah);

  return (
    <div className="w-full">
      <div className="rounded-xl overflow-hidden bg-transparent">
        <a className="block p-4 md:p-5 relative focus:outline-none" href="#">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {Ikon && <Ikon className="h-20 w-20 text-oren" />}
            <div className="text-center lg:text-left">
              <h3 className={`text-xl sm:text-8xl font-bold text-stroke ${jumlahColor}`}>
                {counter}
              </h3>
              <p className="text-2xl uppercase tracking-wide font-bold text-gray-800 text-white">
                {judul}
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default GroupCard;