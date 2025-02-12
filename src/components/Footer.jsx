import Logo from '../components/Logo';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-r from-blue-600/90 to-blue-800/90 text-gray-100 py-6 sm:py-8 md:py-10">
      <div className="relative z-10 max-w-[95rem] px-4 sm:px-6 xl:px-0 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {/* Logo */}
          <div className="flex justify-center sm:justify-start">
            <Logo />
          </div>

          {/* Informasi */}
          <div className="space-y-2 text-center sm:text-left">
            <p className="hover:text-gray-200 text-base sm:text-lg font-medium">
              Badan Pusat Statistik
            </p>
            <p className="hover:text-gray-200 text-base sm:text-lg font-medium">
              Provinsi Sumatera Barat
            </p>
            <p className="hover:text-gray-200 text-base sm:text-lg font-medium">
              BPS-Statistics Sumatera Barat Province
            </p>
          </div>

          {/* Kontak */}
          <div className="space-y-3 text-center sm:text-left">
            <p className="hover:text-gray-200 text-sm sm:text-base lg:text-lg">
              Jl. Khatib Sulaiman No.48 Padang-Sumatera Barat 25135
            </p>
            <p className="hover:text-gray-200 text-sm sm:text-base lg:text-lg">
              Telp (0751) 442158-442160
            </p>
            <div className="hover:text-gray-200 text-sm sm:text-base lg:text-lg">
              <p>Mailbox:</p>
              <p className="break-words">
                sumbar@bps.go.id atau pst1300@bps.go.id
              </p>
            </div>
          </div>
        </div>

        {/* Garis dan Hak Cipta */}
        <div className="border-t border-gray-200/30 mt-6 sm:mt-8 md:mt-10">
          <p className="text-xs sm:text-sm text-center py-4 sm:py-5">
            Hak Cipta © 2025 Badan Pusat Statistik Provinsi Sumatera Barat
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;