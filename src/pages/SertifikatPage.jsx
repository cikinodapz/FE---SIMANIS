import { useState } from 'react';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CardImage from "../components/CardImage";
import bps from "../assets/bps.png";
import Button from "../components/Button";
import { Plus, Trash2, Pencil, X } from 'lucide-react';
import Input from '../components/Input';
import DeletedAlert from '../components/DeletedAlert';

const Sertifikat = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [namaSertifikat, setNamaSertifikat] = useState("");
  const [gambar, setGambar] = useState(null);

  const handleFileChange = (e) => {
    setGambar(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nama Sertifikat:", namaSertifikat);
    console.log("Gambar Sertifikat:", gambar);
  };

  return (
    <div className="flex shadow max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] h-screen w-screen">
        <Navbar />
        <div className="p-[100px] h-screen">
          <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-blue-premier text-3xl font-bold">Daftar Sertifikat</h1>
              <Button
                label={"Sertifikat"}
                variant="blue"
                ikon={<Plus />}
                onClick={() => setIsPopupVisible(true)} 
              />
            </div>
            <div className="my-4 flex items-center justify-center space-x-4 gap-5 grid grid-cols-4">
            <CardImage
        image={<img src={bps} alt="Certificate" className="w-full h-full object-cover rounded-t-xl" />}
        label="Sertifikat 1"
      />
      <CardImage
        image={<img src={bps} alt="Certificate" className="w-full h-full object-cover rounded-t-xl" />}
        label="Sertifikat 2"
      />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pop-up */}
{isPopupVisible && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
     <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-4">Tambah Sertifikat</h2>
        <X onClick={() => setIsPopupVisible(false)} className='hover:text-red-600 mt-1 mr-3'/>
     </div> 
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nama Sertifikat</label>
          <Input
            type="text"
            value={namaSertifikat}
            onChange={(e) => setNamaSertifikat(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Upload Gambar</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="flex justify-center space-x-3">
          
         
          <Button
            label="Tambah"
            variant="blue"
            type="submit"
          />
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Sertifikat;
