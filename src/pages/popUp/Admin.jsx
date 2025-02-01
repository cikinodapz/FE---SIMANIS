import React from "react";
import Button from "../../components/Button";
import ButtonTutup from "../../components/ButtonTutup";

const Popup = ({ isVisible, onClose, onSubmit, formData, onInputChange, editPegawai }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-md rounded-lg p-6 w-96 relative">
        <h2 className="text-2xl font-semibold mb-6 text-blue-premier">
          {editPegawai ? "Edit Pegawai" : "Tambah Pegawai Baru"}
        </h2>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nama</label>
              <input
                type="text"
                name="nama"
                placeholder="Nama"
                value={formData.nama}
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
              <label className="text-sm font-medium text-gray-700">NIP</label>
              <input
                type="text"
                name="nip"
                placeholder="NIP"
                value={formData.nip}
                onChange={onInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Jabatan</label>
              <input
                type="text"
                name="jabatan" 
                placeholder="Jabatan"
                value={formData.jabatan}
                onChange={onInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            {!editPegawai && ( // Hanya tampilkan role dan password saat menambah pegawai baru
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={onInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="Pegawai">Pegawai</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password || ''}
                    onChange={onInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <ButtonTutup onClick={onClose} className="text-red-500 hover:underline">
              Batal
            </ButtonTutup>
            <Button 
              type="submit" 
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              {editPegawai ? "Simpan Perubahan" : "Tambah Pegawai"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;