import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  
  if (!token) {
    // Redirect to login if there's no token
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (for routes that should not be accessible when logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  
  if (token) {
    // Redirect to dashboard if user is already logged in
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />
        <Route path="/landing" element={<Landing />} />
        <Route path="/registerKelompok" element={<RegisterKelompok />} />
        <Route path="/registerPeserta" element={<RegisterPeserta />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-pendaftar"
          element={
            <PrivateRoute>
              <ListPendaftar />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-peserta-magang"
          element={
            <PrivateRoute>
              <ListPesertaMagang />
            </PrivateRoute>
          }
        />
        <Route
          path="/form-tugas"
          element={
            <PrivateRoute>
              <FormTugas />
            </PrivateRoute>
          }
        />
        <Route
          path="/arsip-peserta-magang"
          element={
            <PrivateRoute>
              <ArsipPesertaMagang />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-management"
          element={
            <PrivateRoute>
              <AdminManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/biodata"
          element={
            <PrivateRoute>
              <BiodataPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/daftarTugas"
          element={
            <PrivateRoute>
              <DaftarTugas />
            </PrivateRoute>
          }
        />
        <Route
          path="/sertifikat"
          element={
            <PrivateRoute>
              <TemplateManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/sertifikatPeserta"
          element={
            <PrivateRoute>
              <SertifikatPeserta />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;