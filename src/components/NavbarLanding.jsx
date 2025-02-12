import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NavbarLanding = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when window resizes to prevent menu issues
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: "Home", href: "#home" },
    { name: "Layanan", href: "#layanan" },
    { name: "Tujuan", href: "#tujuan" },
    { name: "Panduan", href: "#panduan" },
    { name: "Kontak", href: "#kontak" },
    { name: "Login", href: "/login" },
  ];

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? "bg-gradient-to-r from-blue-600/95 to-blue-800/95 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[85rem] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-3">
          {/* Logo and Title */}
          <Link
            to="/#"
            className="flex items-center gap-x-2 text-white"
            aria-label="Brand - Badan Pusat Statistik"
          >
            <img
              src="/assets/logo.png"
              alt="Logo Badan Pusat Statistik"
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
            />
            <div className="grid grid-rows-2 gap-0">
              <div className="text-xs sm:text-sm md:text-lg lg:text-xl font-sans italic font-bold leading-tight">
                BADAN PUSAT STATISTIK
              </div>
              <div className="text-xs sm:text-sm md:text-lg lg:text-xl italic font-sans font-bold leading-tight">
                PROVINSI SUMATERA BARAT
              </div>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-blue-700/50 rounded-lg transition-colors"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 sm:w-7 sm:h-7" />
            ) : (
              <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {menuItems.map((item, index) => (
              item.href.startsWith("#") ? (
                <a
                  key={index}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="text-lg xl:text-xl text-white hover:text-blue-200 hover:font-bold transition-all duration-200"
                  aria-label={`Link ke ${item.name}`}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={index}
                  to={item.href}
                  className="text-lg xl:text-xl text-white hover:text-blue-200 hover:font-bold transition-all duration-200"
                  aria-label={`Link ke ${item.name}`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? "max-h-[400px] opacity-100" 
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4 py-4">
            {menuItems.map((item, index) => (
              <div key={index} className="w-full">
                {item.href.startsWith("#") ? (
                  <a
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className="block w-full text-base sm:text-lg text-white hover:bg-blue-700/50 py-2 px-3 rounded-lg transition-colors duration-200"
                    aria-label={`Link ke ${item.name}`}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className="block w-full text-base sm:text-lg text-white hover:bg-blue-700/50 py-2 px-3 rounded-lg transition-colors duration-200"
                    aria-label={`Link ke ${item.name}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavbarLanding;