import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard"; 
import ListPendaftar from "./pages/Kelompok";
import ListPesertaMagang from "./pages/ListPesertaMagang";
import FormTugas from "./pages/FormTugas"; // Import halaman Form Tugas
import ArsipPesertaMagang from "./pages/ArsipPesertaMagang"; // Import halaman Arsip Peserta Magang
import AdminManagement from "./pages/AdminManagement";
import BiodataPage from "./pages/BiodataPage";
import Landing from "./pages/LandingPage";
import DaftarTugas from "./pages/DaftarTugas";
import Sertifikat from "./pages/SertifikatPage";
import SertifikatPeserta from "./pages/SertifikatPesertaPage";
import RegisterKelompok from "./pages/RegisterKelompok";
import RegisterPeserta from "./pages/RegisterPesertaPage";
import Login from "./pages/LoginPage";
//halo ges
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
        <Route path="/list-pendaftar" element={<ListPendaftar />} /> {/* List Pendaftar route */}
        <Route path="/list-peserta-magang" element={<ListPesertaMagang />} /> {/* List Peserta Magang route */}
        <Route path="/form-tugas" element={<FormTugas />} /> {/* Form Tugas route */}
        <Route path="/arsip-peserta-magang" element={<ArsipPesertaMagang />} /> {/* Arsip Peserta Magang route */}
        <Route path="/admin-management" element={<AdminManagement />} /> {/* Admin Management route */}
        <Route path="/biodata" element={<BiodataPage />} /> {/* Biodata route */}
        <Route path="/landing" element={<Landing />} /> {/* Biodata route */}
        <Route path="/daftarTugas" element={<DaftarTugas />} /> {/* Biodata route */}
        <Route path="/sertifikat" element={<Sertifikat />} /> {/* Biodata route */}
        <Route path="/sertifikatPeserta" element={<SertifikatPeserta />} /> {/* Biodata route */}
        <Route path="/registerKelompok" element={<RegisterKelompok />} /> {/* Biodata route */}
        <Route path="/registerPeserta" element={<RegisterPeserta />} /> {/* Biodata route */}




      </Routes>
    </Router>
  );
};

export default App;
