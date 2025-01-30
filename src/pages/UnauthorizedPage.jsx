import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  
  const handleRedirect = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === 'Peserta') {
        navigate('/biodata');
      } else if (decodedToken.role === 'Admin') {
        navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Akses Tidak Diizinkan
        </h2>
        <p className="text-gray-600 mb-6">
          Maaf, Anda tidak memiliki akses ke halaman ini.
        </p>
        <button
          onClick={handleRedirect}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Kembali ke Halaman Utama
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;