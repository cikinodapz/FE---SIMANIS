import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import ButtonTutup from "../components/ButtonTutup"; // Import ButtonTutup component
import { FaEye, FaTrash } from "react-icons/fa"; // Import icons

const ArsipPesertaMagang = () => {
  const [arsipPesertaMagang, setArsipPesertaMagang] = useState([
    {
      nama: "John Doe",
      institusi: "Universitas A",
      jurusan: "Teknik Informatika",
      surat: [],
      status: "Tidak Tersedia",
    },
    {
      nama: "Jane Doe",
      institusi: "Universitas B",
      jurusan: "Sistem Informasi",
      surat: [],
      status: "Belum Lengkap",
    },
    {
      nama: "Alex Smith",
      institusi: "Universitas C",
      jurusan: "Manajemen",
      surat: [
        { namaSurat: "Surat Pengantar", file: "pengantar.pdf" },
        { namaSurat: "Surat Balasan", file: "balasan.pdf" },
      ],
      status: "Lengkap",
    },
  ]);

  const [selectedSurat, setSelectedSurat] = useState("Surat Pengantar");
  const [selectedPeserta, setSelectedPeserta] = useState([]);
  const [file, setFile] = useState(null);
  const [viewDetailIndex, setViewDetailIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckboxChange = (index) => {
    if (selectedPeserta.includes(index)) {
      setSelectedPeserta(selectedPeserta.filter((i) => i !== index));
    } else {
      setSelectedPeserta([...selectedPeserta, index]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("Harap pilih file untuk diupload.");
      return;
    }

    const updatedArsip = [...arsipPesertaMagang];
    selectedPeserta.forEach((index) => {
      const peserta = updatedArsip[index];
      peserta.surat.push({ namaSurat: selectedSurat, file });

      // Update status
      const suratTypes = ["Surat Pengantar", "Surat Balasan"];
      const uploadedTypes = peserta.surat.map((s) => s.namaSurat);
      peserta.status =
        suratTypes.every((type) => uploadedTypes.includes(type))
          ? "Lengkap"
          : "Belum Lengkap";
    });

    setArsipPesertaMagang(updatedArsip);
    setSelectedPeserta([]);
    setFile(null);
    alert("File berhasil diupload!");
  };

  const handleDeleteSurat = (pesertaIndex, suratIndex) => {
    const updatedArsip = [...arsipPesertaMagang];
    updatedArsip[pesertaIndex].surat.splice(suratIndex, 1);

    // Update status
    const suratTypes = ["Surat Pengantar", "Surat Balasan"];
    const uploadedTypes = updatedArsip[pesertaIndex].surat.map((s) => s.namaSurat);
    updatedArsip[pesertaIndex].status =
      suratTypes.every((type) => uploadedTypes.includes(type))
        ? "Lengkap"
        : updatedArsip[pesertaIndex].surat.length > 0
        ? "Belum Lengkap"
        : "Tidak Tersedia";

    setArsipPesertaMagang(updatedArsip);
  };

  const handleDeletePeserta = (index) => {
    const updatedArsip = arsipPesertaMagang.filter((_, i) => i !== index);
    setArsipPesertaMagang(updatedArsip);
    alert("Peserta berhasil dihapus.");
  };

  const openModal = (index) => {
    setViewDetailIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setViewDetailIndex(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-[250px]">
        <Navbar />
        <div className="p-[100px]">
          <h1 className="text-blue-premier text-3xl font-bold">
            Arsip Peserta Magang
          </h1>
          <p className="text-sm text-gray-500">Arsip Surat Peserta Magang</p>

          <table className="w-full border-collapse mt-6">
            <thead>
              <tr className="bg-blue-premier text-white">
                <th className="p-4 border border-gray-300">Pilih</th>
                <th className="p-4 border border-gray-300">Nama Peserta</th>
                <th className="p-4 border border-gray-300">Institusi</th>
                <th className="p-4 border border-gray-300">Jurusan</th>
                <th className="p-4 border border-gray-300">Status</th>
                <th className="p-4 border border-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {arsipPesertaMagang.map((peserta, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50 transition-all ease-in-out"
                >
                  <td className="p-4 border border-gray-300 text-center">
                    <input
                      type="checkbox"
                      checked={selectedPeserta.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td className="p-4 border border-gray-300">{peserta.nama}</td>
                  <td className="p-4 border border-gray-300">
                    {peserta.institusi}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {peserta.jurusan}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {peserta.status}
                  </td>
                  <td className="p-4 border border-gray-300 text-center">
                    <button
                      onClick={() => openModal(index)}
                      className="bg-blue-premier text-white p-2 rounded"
                    >
                      <FaEye /> {/* Detail icon */}
                    </button>
                    <button
                      onClick={() => handleDeletePeserta(index)}
                      className="bg-red-500 text-white p-2 rounded ml-2"
                    >
                      <FaTrash /> {/* Trash icon */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-md shadow-lg w-1/2 relative">
      <h2 className="text-lg font-bold">
        Detail Arsip: {arsipPesertaMagang[viewDetailIndex].nama}
      </h2>
      <table className="mt-4 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border border-gray-300">Nama Surat</th>
            <th className="p-2 border border-gray-300">File</th>
            <th className="p-2 border border-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {arsipPesertaMagang[viewDetailIndex].surat.map((surat, i) => (
            <tr key={i}>
              <td className="p-2 border border-gray-300">{surat.namaSurat}</td>
              <td className="p-2 border border-gray-300">{surat.file}</td>
              <td className="p-2 border border-gray-300 text-center">
                <button
                  onClick={() => handleDeleteSurat(viewDetailIndex, i)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  <FaTrash /> {/* Trash icon */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Close button (X) */}
      <button
        onClick={closeModal}
        className="absolute top-2 right-2 text-2xl font-bold text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
    </div>
  </div>
)}



          <div className="mt-6">
            <h2 className="text-lg font-bold">Upload Surat</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold">Pilih Surat:</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="namaSurat"
                      value="Surat Pengantar"
                      checked={selectedSurat === "Surat Pengantar"}
                      onChange={(e) => setSelectedSurat(e.target.value)}
                      className="mr-2"
                    />
                    Surat Pengantar
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="namaSurat"
                      value="Surat Balasan"
                      checked={selectedSurat === "Surat Balasan"}
                      onChange={(e) => setSelectedSurat(e.target.value)}
                      className="mr-2"
                    />
                    Surat Balasan
                  </label>
                </div>
              </div>

              <div>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              <Button onClick={handleUpload}>Upload Surat</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArsipPesertaMagang;
