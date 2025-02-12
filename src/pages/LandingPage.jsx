import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import intern7 from "/assets/intern7.jpg";
import intern8 from "/assets/intern8.jpg";
import intern9 from "/assets/intern9.jpg";
import intern10 from "/assets/intern10.jpg";
import intern12 from "/assets/intern12.jpg";
import StatisticsSection from '../components/StatisticsSection'; 
import Carrousel from "../components/Carrousel";
import NavbarLanding from "../components/NavbarLanding";
import Button from "../components/Button";
import Card from "../components/Card";
import Footer from "../components/Footer";
import ScrollButton from "../components/Scroll";
import {
  Award,
  ChartNoAxesCombined,
  CircleUser,
  ClipboardCheck,
  BookText,
  Shield
} from "lucide-react";
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

  const [activeIndex, setActiveIndex] = useState(0);
  const cards = [
    {
      title: "Dashboard",
      deskripsi:
        "Menampilkan statistik tugas peserta, termasuk jumlah tugas selesai, tugas dalam proses, dan pencapaian selama magang secara real-time.",
      Ikon: ChartNoAxesCombined,
      iconColor: "text-blue-sky border-blue-500",
    },
    {
      title: "Biodata",
      deskripsi:
        "Informasi pribadi peserta, seperti nama, institusi asal, dan kontak, yang dapat diperbarui sesuai kebutuhan administrasi.",
      Ikon: CircleUser,
      iconColor: "text-green border-green",
    },
    {
      title: "Tugas",
      deskripsi:
        "Daftar tugas peserta dengan deskripsi, tenggat waktu, dan status penyelesaian untuk memantau progres dengan mudah.",
      Ikon: ClipboardCheck,
      iconColor: "text-oren border-oren",
    },
    {
      title: "Logbook",
      deskripsi:
        "Catatan aktivitas harian peserta, memuat pekerjaan, tantangan, dan pembelajaran, serta akses bagi mentor untuk evaluasi.",
      Ikon: BookText,
      iconColor: "text-blue-sky border-blue-sky",
    },
    {
      title: "Sertifikat",
      deskripsi:
        "Sistem otomatis yang mengeluarkan sertifikat digital setelah peserta menyelesaikan program magang.",
      Ikon: Award,
      iconColor: "text-green border-green",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cards.length]);

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

  const images = [intern8, intern10, intern9, intern12];

  const words = ["Selamat", "Datang", "di", "SIMANIS"];
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (wordIndex < words.length) {
      if (charIndex < words[wordIndex].length) {
        const timer = setTimeout(() => {
          setDisplayText((prev) => prev + words[wordIndex][charIndex]);
          setCharIndex(charIndex + 1);
        }, 100);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setDisplayText((prev) => prev + " ");
          setWordIndex(wordIndex + 1);
          setCharIndex(0);
        }, 500);
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => {
        setDisplayText("");
        setWordIndex(0);
        setCharIndex(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [wordIndex, charIndex]);

  const formattedText = displayText.split(" ").map((word, index) => {
    return index === 3 ? (
      <span key={index} className="text-green font-bold">
        {word}
      </span>
    ) : (
      word + " "
    );
  });

  const steps = [
    {
      text: "Akses laman Register Kelompok",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    },
    {
      text: "Ketua Tim mendaftarkan kelompok di SIMANIS",
      bgColor: "bg-transparent",
      textColor: "text-white",
    },
    {
      text: "Ketua Tim mengecek email untuk mendapatkan kode kelompok.",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    },
    {
      text: "Setiap peserta melakukan registrasi pribadi dan memasukkan kode kelompok dari Ketua Tim.",
      bgColor: "bg-transparent",
      textColor: "text-white",
    },
    {
      text: "Masing-masing peserta login ke akun SIMANIS.",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    },
  ];

  return (
    <div className="bg-blue-50">
      {/* Navbar */}
      <NavbarLanding
        className={`transition duration-300 ${
          navbarSolid ? "bg-blue-premier shadow-lg" : "bg-transparent"
        }`}
      />

      {/* Home Section */}
      <section
        id="home"
        className="relative w-full h-screen flex items-center justify-center text-white bg-cover bg-center"
        style={{ backgroundImage: `url(${intern7})` }}
      >
        <div className="absolute inset-0 bg-black/70 z-0"></div>
        <div className="flex justify-start grid grid-cols-1 md:grid-cols-2 pl-4 md:pl-12 max-w-[95rem]">
          <div className="relative z-10 text-start pr-4 md:pr-20">
            <h1 className="text-4xl md:text-7xl font-bold mb-4 min-h-[6rem]">
              {formattedText}
            </h1>
            <p className="text-lg md:text-xl mt-10">
              Sistem Pengelolaan Magang BPS Sumbar{" "}
              <span className="text-green font-medium">(SIMANIS)</span> adalah
              platform digital untuk mengelola data magang, pembagian unit
              kerja, pemantauan peserta, dan penerbitan sertifikat secara
              efisien dan transparan.
            </p>
            <div className="flex justify-start gap-5 mt-10">
              <Link to="/login">
                <Button className="font-bold" label="Login" variant="blue" />
              </Link>
              <Link to="/registerKelompok">
                <Button label="Register" variant="oren" className="font-bold" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Section */}
      <section
        id="layanan"
        className="bg-gradient-to-t from-blue-100 via-blue-0 to-white"
      >
        <div className="max-w-7xl mx-auto py-16 px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-[1.4] text-shadow-lg">
              LAYANAN UTAMA
            </h1>
          </div>

          <motion.div
            className="flex justify-center items-center gap-2 overflow-hidden p-7"
            layout
          >
            <AnimatePresence>
              {cards.map((card, index) => {
                const position =
                  (index - activeIndex + cards.length) % cards.length;
                const isCenter = position === 0;

                return (
                  <motion.div
                    key={card.title}
                    className="w-64"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: isCenter ? 1 : 0.9,
                      zIndex: isCenter ? 10 : 0,
                    }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card {...card} isCenter={isCenter} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Statistik Section */}
      <motion.section
        id="statistik"
        className="relative bg-gradient-to-r from-blue-600/90 to-blue-800/90 flex justify-center gap-0 py-10 overflow-hidden"
      >
        <motion.div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full opacity-50"
              style={{
                width: `${Math.random() * 6 + 4}px`,
                height: `${Math.random() * 6 + 4}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.1, 1],
                x: [0, Math.random() * 5 - 2.5, 0],
                y: [0, Math.random() * 5 - 2.5, 0],
              }}
              transition={{
                duration: Math.random() * 500 + 500,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </motion.div>

        <StatisticsSection /> 
      </motion.section>

      {/* Tujuan Section */}
      <motion.section
        id="tujuan"
        className="py-20 bg-gradient-to-b from-blue-100 via-blue-0 to-white"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="max-w-[95rem] mx-auto grid md:grid-cols-2 p-4 md:p-20 gap-10 md:gap-20 items-center">
          {/* Kolom Kiri */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-2 rounded-lg border-2 border-blue-premier">
                <Shield className="h-12 w-12 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-blue-800 bg-transparant " />
              </div>

              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent bg-white text-shadow-lg">
                TUJUAN
              </h2>
            </div>
            <div className="mt-10 space-y-6 text-lg font-serif">
              <div className="flex flex-col gap-2">
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <strong>Mengaplikasikan Teori ke Praktik</strong>
                </div>
                <p className="text-justify px-4">
                  Magang memberikan kesempatan untuk mengaplikasikan pengetahuan
                  yang diperoleh di bangku kuliah ke dalam situasi dunia kerja
                  yang nyata, memperdalam pemahaman materi yang telah
                  dipelajari.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <strong>Meningkatkan Keterampilan Kerja</strong>
                </div>
                <p className="text-justify px-4">
                  Melalui pengalaman langsung, peserta magang dapat mengasah
                  keterampilan teknis dan non-teknis seperti komunikasi, kerja
                  tim, dan problem solving yang sangat dibutuhkan dalam dunia
                  profesional.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <strong>Memperluas Jaringan Profesional</strong>
                </div>
                <p className="text-justify px-4">
                  Magang memberi kesempatan untuk berinteraksi dengan
                  profesional di industri terkait, yang bisa membuka peluang
                  untuk karier di masa depan.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Kolom Kanan */}
          <motion.div
            className="relative p-8"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div
              className="absolute top-0 bottom-0 right-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90 opacity-100 rounded-xl"
              style={{ width: "70%", height: "100%" }}
            ></div>
            <div className="z-10">
              <Carrousel images={images} />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Panduan Section */}
      <section
        id="panduan"
        className="bg-gradient-to-r from-blue-600/90 to-blue-800/90 flex flex-col items-center"
      >
        <div className="mb-6 mt-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            5 Panduan Singkat Mengakses{" "}
            <span className="font-bold  border-color ">SIMANIS</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 mb-10 gap-0 w-full max-w-5xl border-2 border-white rounded-lg">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${step.bgColor} ${step.textColor} p-5 flex items-start justify-start text-start relative min-h-64 transform transition-all duration-300 hover:scale-105`}
            >
              <div
                className={`absolute top-4 left-4 flex items-center justify-center w-8 h-8 rounded-full 
          ${
            step.bgColor === "bg-gray-100"
              ? "bg-blue-900 text-white"
              : "bg-white text-blue-900"
          } 
          text-xl font-bold`}
              >
                {index + 1}
              </div>

              <div className="text-lg md:text-xl font-serif mt-10">{step.text}</div>
            </div>
          ))}
        </div>
        <div className="mb-10">
          <div className="mb-10">
            <a
              href="https://drive.google.com/file/d/1U7RPcjMaTIZwKEH1JJtxl_uDUeEijwJC/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="oren"
                label="Guide Book"
                className="text-white text-lg"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <motion.section
        className="bg-gradient-to-b from-blue-100 via-blue-0 to-white py-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="max-w-[95rem] mx-auto text-center p-4 md:p-20">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-blue-600 mt-10 text-shadow-lg">
              Magang di BPS Sumbar bareng{" "}
              <span className="text-green font-bold">SIMANIS</span>
            </h2>
            <h2 className="text-3xl md:text-5xl font-bold text-blue-600 text-shadow-lg flex justify-center items-center gap-2 mt-4">
              Siapkan dirimu sekarang! 🚀
            </h2>
            <motion.span
              animate={{ y: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <div className="flex justify-center mt-20">
                <Link to="/registerkelompok">
                  <Button
                    label="Daftar Sekarang"
                    className="text-xl font-bold mb-10 text-white animate-bounce"
                  />
                </Link>
              </div>
            </motion.span>
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