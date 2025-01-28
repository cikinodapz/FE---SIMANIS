import React from "react";
import { User as UserIcon } from "lucide-react";

const Navbar = ({ user }) => {
  return (
    <div className="navbar">
      <header className="fixed top-0 left-0 w-full bg-blue-premier text-sm py-3 shadow z-50">
        <nav className="max-w-[95rem] w-full mx-auto px-4 flex items-center justify-between">
          {/* Brand Section */}
          <a
            className="flex items-center gap-x-2 text-xl font-semibold text-white focus:outline-none focus:opacity-80"
            href="/home"
            aria-label="Brand"
          >
            <img
              src="src/assets/logo.png"
              alt="Logo"
              className="w-10 h-auto mr-2"
            />
            <div className="grid grid-rows-2 grid-flow-col gap-0">
              <div className="text-xl italic font-bold">
                BADAN PUSAT STATISTIK
              </div>
              <div className="text-base italic font-bold">
                PROVINSI SUMATERA BARAT
              </div>
            </div>
          </a>

          {/* User Info Section */}
          <div className="flex items-center gap-x-2 text-white">
            <span className="text-lg font-medium">{user || "Guest"}</span>
            <UserIcon size={33} strokeWidth={1.5} />
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
