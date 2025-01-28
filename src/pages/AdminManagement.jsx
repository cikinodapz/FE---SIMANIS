import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Popup from "./popUp/Admin";
import { Plus, Trash2, Pencil } from 'lucide-react';
import DeletedAlert from "../components/DeletedAlert";


const AdminManagement = () => {
  const [admins, setAdmins] = useState([
    { id: 1, name: "Admin 1", email: "admin1@example.com", role: "admin", password: "password1" },
    { id: 2, name: "Admin 2", email: "admin2@example.com", role: "superadmin", password: "password2" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
    password: "",
  });

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editAdmin) {
      // Update admin
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.id === editAdmin.id ? { ...admin, ...formData } : admin
        )
      );
    } else {
      // Tambah admin baru
      const newAdmin = {
        id: admins.length + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      };
      setAdmins([...admins, newAdmin]);
    }

    setFormData({ name: "", email: "", role: "admin", password: "" });
    setIsPopupVisible(false);
    setEditAdmin(null);
  };

  const handleEditAdmin = (admin) => {
    setEditAdmin(admin);
    setFormData(admin);
    setIsPopupVisible(true);
  };

  const handleDeleteAdmin = (id) => {
    DeletedAlert(
      () => {
        // Callback untuk konfirmasi
        setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== id));
      },
      () => {
        // Callback untuk pembatalan
        console.log("Penghapusan dibatalkan");
      }
    );
  };
  

  return (
    <div className="flex shadow max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] mx-auto h-screen">
        <Navbar />
        <div className="p-[100px]">
          <Popup
            isVisible={isPopupVisible}
            onClose={() => {
              setIsPopupVisible(false);
              setEditAdmin(null);
              setFormData({ name: "", email: "", role: "admin", password: "" });
            }}
            onSubmit={handleFormSubmit}
            formData={formData}
            onInputChange={handleInputChange}
          />

          <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-blue-premier text-3xl font-bold">Daftar Admin</h1>
              <Button
                label={"Admin"}
                variant="blue"
                ikon={<Plus />}
                onClick={() => setIsPopupVisible(true)} // Menampilkan modal saat tombol ditekan
              />
            
             
            </div>
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-premier text-white">
                  <th className="border border-gray-300 p-2 text-center">Nama</th>
                  <th className="border border-gray-300 p-2 text-center">Email</th>
                  <th className="border border-gray-300 p-2 text-center">Role</th>
                  <th className="border border-gray-300 p-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="text-center hover:bg-blue-50">
                    <td className="border border-gray-300 p-2">{admin.name}</td>
                    <td className="border border-gray-300 p-2">{admin.email}</td>
                    <td className="border border-gray-300 p-2">{admin.role}</td>
                    <td className="border border-gray-300 p-2 flex items-center justify-center space-x-4">
                      <div className="p-2 rounded-lg bg-white shadow-lg">
                      <Pencil
                        onClick={() => handleEditAdmin(admin)}
                        className="text-yellow-600 hover:underline focus:outline-none"

                      />
                      </div>
                      <div className="p-2 rounded-lg bg-white shadow-lg">
                      <Trash2
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-red-500 hover:underline focus:outline-none"

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

export default AdminManagement;
