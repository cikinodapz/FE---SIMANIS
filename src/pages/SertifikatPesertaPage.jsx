import React, { useState } from "react"; // Menambahkan useState dari React
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { Plus } from 'lucide-react';
import bps from "../assets/bps.png"; // Pastikan gambar bps.png diimpor dengan benar

const SertifikatPeserta = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  return (
    <div className="flex shadow max-w-[95rem] mx-auto ">
      <Sidebar />
      <div className="flex-1 ml-[250px] h-screen ">
        <Navbar />
        <div className="p-[100px]">
          <div className="shadow-lg p-6 bg-white rounded-md mt-10 ">
            <h1 className="text-blue-premier text-3xl font-bold">Sertifikat</h1>
            <p className="text-sm text-gray-500">Sertifikat Magang</p>
            <div className="mt-10 bg-gray-200 shadow-lg rounded-lg">
              <img 
                src={bps} 
                alt="Sertifikat BPS" 
                className="w-full h-[700px] object-cover rounded-lg" // Ukuran gambar diatur
              />
            </div>

            <div className="flex justify-center font-medium mt-3">
              <a 
                href={bps} // Link ke gambar
                download="sertifikat-bps.png" // Nama file saat di-download
              >
                <Button
                  label={"Download"}
                  variant="blue"
                  onClick={() => setIsPopupVisible(true)} // Menampilkan pop-up jika diperlukan
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SertifikatPeserta;
