import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types';

const validateToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (Date.now() >= decoded.exp * 1000) return null;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const ProtectedRoute = ({ children, roles = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const decoded = validateToken(token);
    
    if (!decoded) {
      localStorage.removeItem("accessToken");
      setAuth(null);
    } else {
      setAuth({
        role: decoded.role,
        isAuthorized: roles.length === 0 || roles.includes(decoded.role)
      });
    }
    
    setIsLoading(false);
  }, [roles]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Jika tidak terautentikasi, redirect ke login
  if (!auth) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Handle root dan login path untuk redirect awal setelah login
  if (location.pathname === "/" || location.pathname === "/login") {
    return <Navigate to={auth.role === "Admin" ? "/dashboard" : "/statistik"} replace />;
  }

  // Jika user mencoba mengakses halaman yang tidak diizinkan
  if (!auth.isAuthorized && auth.role === "Admin" && location.pathname === "/statistik") {
    return <Navigate to="/unauthorized" replace />;
  }

  if (!auth.isAuthorized && auth.role === "User" && location.pathname.startsWith("/")) {
    return <Navigate to="/statistik" replace />;
  }

  if (!auth.isAuthorized && auth.role === "Pegawai" && location.pathname.startsWith("/")) {
    return <Navigate to="/form-tugas-pegawai" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const decoded = validateToken(token);
    
    if (decoded) {
      setIsAuthenticated(true);
      setUserRole(decoded.role);
    } else {
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      setUserRole(null);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={
          userRole === "Admin"
            ? "/dashboard"
            : userRole === "Pegawai"
            ? "/form-tugas-pegawai"
            : "/statistik"
        }
        replace
      />
    );
  }
  

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string)
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
};