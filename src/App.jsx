import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoutes";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ListPendaftar from "./pages/Kelompok";
import ListPesertaMagang from "./pages/ListPesertaMagang"; 
import FormTugas from "./pages/FormTugas";
import ArsipPesertaMagang from "./pages/ArsipPesertaMagang";
import AdminManagement from "./pages/AdminManagement";
import BiodataPage from "./pages/BiodataPage";
import Landing from "./pages/LandingPage";
import DaftarTugas from "./pages/DaftarTugas";
import SertifikatPeserta from "./pages/SertifikatPesertaPage";
import RegisterKelompok from "./pages/RegisterKelompok";
import RegisterPeserta from "./pages/RegisterPesertaPage";
import Login from "./pages/LoginPage";
import TemplateManagement from "./pages/SertifikatPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import FormTugasByPegawai from "./pages/FormTugasByPegawai"
import Dashboardpeserta from "./pages/DashboardPeserta";
import AdminNotifications from "./pages/AdminNotification";


const App = () => {
 return (
   <Router>
     <Routes>
       {/* Public Routes */}
       <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
       <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
       <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
       <Route path="/landing" element={<Landing />} />
       <Route path="/registerKelompok" element={<RegisterKelompok />} />
       <Route path="/registerPeserta" element={<RegisterPeserta />} />
       <Route path="/unauthorized" element={<UnauthorizedPage />} />
       

       {/* Admin Routes */}
       <Route path="/dashboard" element={<ProtectedRoute roles={['Admin']}><Dashboard /></ProtectedRoute>} />
       <Route path="/list-pendaftar" element={<ProtectedRoute roles={['Admin']}><ListPendaftar /></ProtectedRoute>} />
       <Route path="/list-peserta-magang" element={<ProtectedRoute roles={['Admin']}><ListPesertaMagang /></ProtectedRoute>} />
       <Route path="/form-tugas" element={<ProtectedRoute roles={['Admin']}><FormTugas /></ProtectedRoute>} />
       <Route path="/arsip-peserta-magang" element={<ProtectedRoute roles={['Admin']}><ArsipPesertaMagang /></ProtectedRoute>} />
       <Route path="/admin-management" element={<ProtectedRoute roles={['Admin']}><AdminManagement /></ProtectedRoute>} />
       <Route path="/sertifikat" element={<ProtectedRoute roles={['Admin']}><TemplateManagement /></ProtectedRoute>} />
       <Route path="/notifadmin" element={<ProtectedRoute roles={['Admin']}><AdminNotifications /></ProtectedRoute>} />

       {/* Peserta Routes */}
       <Route path="/biodata" element={<ProtectedRoute roles={['User']}><BiodataPage /></ProtectedRoute>} />
       <Route path="/daftarTugas" element={<ProtectedRoute roles={['User']}><DaftarTugas /></ProtectedRoute>} />
       <Route path="/sertifikatPeserta" element={<ProtectedRoute roles={['User']}><SertifikatPeserta /></ProtectedRoute>} />
       <Route path="/statistik" element={<ProtectedRoute roles={['User']}><Dashboardpeserta /></ProtectedRoute>} />


       {/*pegawai Routes*/}
       <Route path="/form-tugas-pegawai" element={<ProtectedRoute roles={['Pegawai']}><FormTugasByPegawai /></ProtectedRoute>} />
       <Route path="/notifpegawai" element={<ProtectedRoute roles={['Pegawai']}><AdminNotifications /></ProtectedRoute>} />
     </Routes>
   </Router>
 );
};

//DONE SAMPAI SINI (Dashhboarddddd)
//DONE SAMPAI NOTIF DI ADMIN DAN JUGA PEGAWAI MENYALAAAA

export default App;