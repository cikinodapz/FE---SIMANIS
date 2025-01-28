import React from "react";
import Button from "../../components/Button";
import ButtonTutup from "../../components/ButtonTutup";
import Input from "../../components/Input";

const Popup = ({ isVisible, onClose, onSubmit, formData, onInputChange }) => {
  if (!isVisible) return null; // Jangan render apa pun jika popup tidak terlihat

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <h2 className="text-2xl font-semibold mb-6 text-blue-premier">Tambah Admin Baru</h2>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nama</label>
              <input
                type="text"
                name="name"
                placeholder="Nama"
                value={formData.name}
                onChange={onInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={onInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={onInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={onInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <ButtonTutup onClick={onClose} className="text-red-500 hover:underline">
              Batal
            </ButtonTutup>
            <Button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Tambah Admin
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;
