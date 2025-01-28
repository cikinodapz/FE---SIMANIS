import Button from "./Button";
import { Link } from "react-router-dom";


const NavbarLanding = ({ className = "" }) => {
  return (
    <header
      className={`flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-blue-premier text-sm py-3 sticky top-0 z-10 ${className}`}
    >
      <nav className="max-w-[85rem] w-full mx-auto px-4 flex items-center justify-between">
        <a
          className="flex items-center gap-x-2 text-xl font-semibold text-white focus:outline-none focus:opacity-80"
          href="/home"
          aria-label="Brand - Badan Pusat Statistik"
        >
          <img
            src="src/assets/logo.png"
            alt="Logo Badan Pusat Statistik"
            className="w-12 h-12 h-auto"
          />
          <div className="grid grid-rows-2 gap-0">
            <div className="text-xl italic font-bold leading-none">
              BADAN PUSAT STATISTIK
            </div>
            <div className="text-base italic font-bold leading-none">
              PROVINSI SUMATERA BARAT
            </div>
          </div>
        </a>

        <div className="flex items-center gap-5 mt-5 sm:mt-0 sm:ps-5">
          <a
            className="text-lg text-white hover:text-gray-400 focus:outline-none"
            href="#home"
            aria-label="Link ke Home"
          >
            Home
          </a>
          <a
            className="text-lg text-white hover:text-gray-400 focus:outline-none"
            href="#tujuan"
            aria-label="Link ke Tujuan"
          >
            Tujuan
          </a>
          <a
            className="text-lg text-white hover:text-gray-400 focus:outline-none"
            href="#kontak"
            aria-label="Link ke Kontak"
          >
            Kontak
          </a>
          <Link to="/login">
          <Button
            variant="primary"
            label="Login"
            className="font-bold text-lg"
            aria-label="Tombol Login"
          />
          </Link>
          
        </div>
      </nav>
    </header>
  );
};

export default NavbarLanding;
