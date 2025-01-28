import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/Button"; // Import komponen Button
import { FaInfoCircle } from "react-icons/fa";
import Input from "../components/Input";
import { Info } from "lucide-react";
import Select from "../components/Select";

const ListPesertaMagang = () => {
  const daftarPesertaMagang = [
    {
      nama: "John Doe",
      institusi: "Universitas A",
      jurusan: "Teknik Informatika",
      status: "Aktif",
      keterangan: "Diproses",
      tglDaftar: "2024-01-01",
    },
    {
      nama: "Jane Doe",
      institusi: "Universitas B",
      jurusan: "Sistem Informasi",
      status: "Selesai",
      keterangan: "Diproses",
      tglDaftar: "2024-02-15",
    },
    {
      nama: "Alex Smith",
      institusi: "Universitas C",
      jurusan: "Manajemen",
      status: "Aktif",
      keterangan: "Diproses",
      tglDaftar: "2024-01-25",
    },
    {
      nama: "Sarah Johnson",
      institusi: "Universitas D",
      jurusan: "Ekonomi",
      status: "Selesai",
      keterangan: "Diproses",
      tglDaftar: "2024-03-10",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [sortedPesertaMagang, setSortedPesertaMagang] = useState(daftarPesertaMagang);

  const handleSort = (order) => {
    const sorted = [...sortedPesertaMagang].sort((a, b) => {
      if (order === "newest")
        return new Date(b.tglDaftar) - new Date(a.tglDaftar);
      if (order === "oldest")
        return new Date(a.tglDaftar) - new Date(b.tglDaftar);
      return 0;
    });
    setSortedPesertaMagang(sorted);
  };

  const handleToggleApproval = (index) => {
    const updatedPesertaMagang = [...sortedPesertaMagang];
    const peserta = updatedPesertaMagang[index];

    if (peserta.keterangan === "Pending") {
      peserta.keterangan = "Selesai";
      peserta.status = "Non-Aktif"; // Status otomatis jadi Non-Aktif
    } else if (peserta.keterangan === "Selesai") {
      peserta.keterangan = "Pending";
      peserta.status = "Aktif"; // Status otomatis jadi Aktif
    }

    setSortedPesertaMagang(updatedPesertaMagang);
  };

  const getStatusStyle = (status) => {
    return status === "Aktif" ? "text-green-500 font-bold" : "text-red-500 font-bold";
  };

  React.useEffect(() => {
    handleSort(sortOrder);
  }, [sortOrder]);

  const filteredPesertaMagang = sortedPesertaMagang.filter((peserta) =>
    peserta.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status untuk aktif
  const [statusAktifState, setStatusAktifState] = useState("aktif");

  // Status untuk opsi umum
  const [statusOptionsState, setStatusOptionsState] = useState("pending");

  const statusAktif = [
    { value: "aktif", label: "Aktif" },
    { value: "nonAktif", label: "Non Aktif" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "selesai", label: "Selesai" },
  ];

  return (
    <div className="flex shadow max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] mx-auto h-screen">
        <Navbar />
        <div className="p-[100px]">
          <div className="shadow-lg p-6 bg-white rounded-md mt-10 ">
            <h1 className="text-blue-premier text-3xl font-bold ">
              Daftar Peserta Magang
            </h1>
            <p className="text-sm text-gray-500">Semua Peserta Magang</p>
            {/* Search Section */}
            <div className="my-4 flex items-center justify-center space-x-4">
              <Input
                type="text"
                placeholder="Cari berdasarkan Nama Peserta"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                px={20}
                className="w-full text-center max-w-lg border border-blue-premier rounded-lg"
              />

              {/* Sorting Dropdown */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
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

            <table className="w-full border-collapse text-center mt-10">
              <thead>
                <tr className="bg-blue-premier text-white border-rounded-lg">
                  <th className="p-2 border border-gray-300">No</th>
                  <th className="p-2 border border-gray-300">Nama Peserta</th>
                  <th className="p-2 border border-gray-300">Institusi</th>
                  <th className="p-2 border border-gray-300">Jurusan</th>
                  <th className="p-2 border border-gray-300">Detail</th>
                  <th className="p-2 border border-gray-300">Status</th>
                  <th className="p-2 border border-gray-300">Persetujuan</th>
                </tr>
              </thead>
              <tbody>
                {filteredPesertaMagang.map((peserta, index) => (
                  <tr key={index} className="hover:bg-blue-50 text-center">
                    <td className="border border-gray-300 p-2 text-sm">{index + 1}</td>
                    <td className="p-2 border border-gray-300">{peserta.nama}</td>
                    <td className="p-2 border border-gray-300">{peserta.institusi}</td>
                    <td className="p-2 border border-gray-300">{peserta.jurusan}</td>
                    <td className="p-6 border flex items-center justify-center space-x-4">
                      <div className="p-2 rounded-lg bg-white shadow-lg ">
                        <Info className="text-blue-500 cursor-pointer" />
                      </div>
                    </td>
                    <td className="p-2 border border-gray-300">
                      <div className="flex justify-center items-center ">
                        <Select
                          options={statusAktif}
                          value={statusAktifState}
                          onChange={(e) => setStatusAktifState(e.target.value)}
                          name="statusAktif"
                          className="mt-3"
                          width="w-25"
                        />
                      </div>
                    </td>

                    <td className="p-1 border border-gray-300 text-center">
                      <div className="flex justify-center items-center ">
                        <Select
                          options={statusOptions}
                          value={statusOptionsState}
                          onClick={() => handleToggleApproval(index)}
                          name="statusOptions"
                          className="mt-3"
                          width="w-25"
                        />
                      </div>
                    </td>
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

export default ListPesertaMagang;
