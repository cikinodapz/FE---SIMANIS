import React from "react";
import { createRoot } from "react-dom/client"; // Gunakan createRoot dari react-dom/client
import App from "./App.jsx";
import "./index.css"; // Jika Anda punya file CSS global
import { DarkModeProvider } from "./context/DarkModeContext.jsx"; // Pastikan path benar

// Render aplikasi ke root
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </React.StrictMode>
);