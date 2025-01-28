// Landing.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import blue from "../assets/blue.jpg";
import bps from "../assets/bps.png";
import Intern from "../assets/intern.jpg";
import NavbarLanding from "../components/NavbarLanding";
import Button from "../components/Button";
import Card from "../components/Card";
import Footer from "../components/Footer";
import ScrollButton from "../components/Scroll";
import { School, Earth, GraduationCap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [navbarSolid, setNavbarSolid] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = () => {
    const homeSection = document.getElementById("home");
    const tujuanSection = document.getElementById("tujuan");
    const tujuanTop = tujuanSection?.getBoundingClientRect().top;

    setNavbarSolid(tujuanTop <= 0);

    const homeRect = homeSection?.getBoundingClientRect();
    setShowScrollButton(homeRect?.bottom <= 0);
  };

  useEffect(() => {
    const debouncedScroll = () => {
      clearTimeout(window.scrollTimeout);
      window.scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener("scroll", debouncedScroll);
    return () => window.removeEventListener("scroll", debouncedScroll);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.1 } },
  };

  return (
    <div className="bg-blue-50 ">
      {/* Navbar */}
      <NavbarLanding
        className={`transition duration-300 ${
          navbarSolid ? "bg-blue-premier shadow-lg" : "bg-transparent"
        }`}
      />

      <section
        id="home"
        className=" absolute relative w-full h-screen flex items-center justify-center text-white bg-cover bg-center m-0 mt-0"
        style={{
          backgroundImage: `url(${blue})`,
          margin: 0,
          padding: 0,
        }}
      >
        <div className="absolute inset-0 z-0" style={{ top: 0 }} />
        <div className="z-10 text-center">
          <h1 className="text-7xl font-bold mb-4">Selamat Datang di SIMANIS</h1>
          <p className="text-2xl mb-6">Langkah untuk Pengalaman Profesional</p>
          <div className="flex justify-center gap-5 mt-3">
            <Link to="/login">
              <Button className="font-bold" label="Login" variant="green" />
            </Link>
            <Link to="/registerKelompok">
              <Button label="Register" variant="oren" className="font-bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tujuan Section */}
      <motion.section
        id="tujuan"
        className="py-20 bg-white"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="max-w-[95rem] mx-auto grid md:grid-cols-2 p-20 gap-20 items-center">
          <img
            src={Intern}
            alt="Gambar BPS"
            className="rounded-2xl shadow-lg"
          />
          <div>
            <div className="flex items-center gap-4">
              <Shield className="h-12 w-12 text-blue-premier" />
              <h2 className="text-5xl font-bold text-blue-premier">TUJUAN</h2>
            </div>
            <ul className="mt-10 space-y-6 text-lg font-serif list-disc list-inside">
              <li>
                <strong>Mengembangkan Kompetensi Statistik:</strong> Memahami
                proses pengumpulan, pengolahan, analisis, dan penyajian data
                statistik resmi.
              </li>
              <li>
                <strong>Penerapan Teori ke Praktik:</strong> Menerapkan teori
                yang telah dipelajari di perkuliahan dalam kegiatan nyata.
              </li>
              <li>
                <strong>Meningkatkan Keterampilan Analitik:</strong>
                Memperdalam kemampuan analisis data melalui perangkat lunak
                seperti SPSS, R, atau Python.
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Statistik Section */}
      <motion.section
        className="bg-cover bg-center"
        style={{ backgroundImage: `url(${bps})` }}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="bg-blue-premier bg-opacity-90">
          <div className="max-w-[95rem] mx-auto grid md:grid-cols-3 gap-10 p-20">
            <Card
              title="90"
              deskripsi="Institusi"
              textColor="text-blue-sky"
              Ikon={School}
            />
            <Card
              title="100"
              deskripsi="Bidang"
              textColor="text-green"
              Ikon={Earth}
            />
            <Card
              title="56"
              deskripsi="Peserta"
              textColor="text-oren"
              Ikon={GraduationCap}
            />
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        className="bg-white py-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="max-w-[95rem] mx-auto text-center p-20">
          <h2 className="text-5xl font-bold text-blue-premier mb-20">
            Ambil Kesempatan dan Kendali Masa Depanmu Sekarang
          </h2>
          <div className="flex justify-center">
            <Button
              label="Daftar Sekarang"
              className="text-xl font-bold mb-5"
            />
          </div>
        </div>
      </motion.section>

      {/* Kontak Section */}
      <section id="kontak">
        <Footer />
      </section>

      {showScrollButton && <ScrollButton />}
    </div>
  );
};

export default Landing;
