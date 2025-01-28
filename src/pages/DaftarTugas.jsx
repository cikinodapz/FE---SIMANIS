import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/Button"; // Import komponen Button
import { FaInfoCircle } from "react-icons/fa";
import Input from "../components/Input";
import Select from "../components/Select";
import { Search } from 'lucide-react';

const DaftarTugas = () => {
  const daftarPesertaMagang = [
    {
      pemilik: "John Doe",
      tugas: "Universitas A",
      deadline: "Teknik Informatika",
      status: "Aktif",
      catatan: "-",
    },
    {
      pemilik: "Jane Doe",
      tugas: "Universitas B",
      deadline: "Sistem Informasi",
      status: "Selesai",
      catatan: "-"

    },
    {
      pemilik: "Alex Smith",
      tugas: "Universitas C",
      deadline: "Manajemen",
      status: "Aktif",
      catatan: "-"

    },
    
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPesertaMagang = daftarPesertaMagang.filter((peserta) =>
    peserta.pemilik.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const [status, setStatus] = useState("pending");

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "selesai", label: "Selesai" },
    { value: "terlambat", label: "Terlambat" },
  ];
  return (
    <div className="flex shadow max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] mx-auto h-screen">
        <Navbar />
        <div className="p-[100px] ">
          <div className="shadow-lg p-6 bg-white rounded-md mt-10 ">
            <h1 className="text-blue-premier text-3xl font-bold ">
              Daftar Tugas
            </h1>
            <p className="text-sm text-gray-500">Semua Daftar Tugas</p>
            {/* Search Section */}
            <div className="my-4 flex items-center justify-center space-x-4">
            <Input
                type="text"
                placeholder="Cari berdasarkan Nama, Email, atau Jurusan"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                px={20}
                className="w-full text-center max-w-lg border border-blue-premier rounded-lg"
              />

              {/* Sorting Dropdown */}
              <select
                className="p-3 border bg-green border-gray-300 text-white font-medium rounded-md"
              >
                <option value="newest" className="text-black bg-white">
                  Terbaru
                </option>
                <option value="oldest" className="text-black bg-white">
                  Terlama
                </option>
              </select>

            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-premier text-white border-rounded-lg ">
                  <th className="p-2 border border-gray-300">Pengarah</th>
                  <th className="p-2 border border-gray-300">Tugas</th>
                  <th className="p-2 border border-gray-300">Deadline</th>
                  <th className="p-2 border border-gray-300">Status</th>
                  <th className="p-2 border border-gray-300">Catatan</th>

                </tr>
              </thead>
              <tbody>
                {filteredPesertaMagang.map((peserta, index) => (
                  <tr key={index} className="hover:bg-blue-50 text-center">
                    <td className="p-2 border border-gray-300">{peserta.pemilik}</td>
                    <td className="p-2 border border-gray-300">{peserta.tugas}</td>
                    <td className="p-2 border border-gray-300">{peserta.deadline}</td>
                    <td className=" border border-gray-300 align-middle">
                        <div className="flex justify-center items-center ">
                        <Select
                            options={statusOptions}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            name="status"
                            className="mt-3"
                            width="w-25"
                        />
                        </div>
                     
                    </td>
                    <td className="p-2 border border-gray-300">{peserta.catatan}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaftarTugas;
