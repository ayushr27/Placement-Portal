import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Broucher from "./Broucher";
import Cta from "./Cta";
import Message from "./Message";
import RecruitmentProcess from "./RecruitmentProcess";
import ContactUs from "./ContactUs";
import Coordinators from "./Coordinators";
import AdminStaff from "./AdminStaff";
import Navbar from "./Navbar";
import PlacementProcess from "./PlacementProcess";
import Footer from "./Footer";
import { Link, Navigate } from "react-router-dom";
import CompanySlider from "./CompanySlider";
import "../css/scroll.css"

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setIsScrolled(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full custom-scroll">
      <Navbar
        className={`transition-all duration-300 ${
          isScrolled ? "bg-blue-600 shadow-md" : "bg-transparent"
        }`}
      />

      <div
        className="relative min-h-[100vh] bg-cover bg-top flex items-center justify-center"
        style={{ backgroundImage: "url(/Hero1.jpeg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/50 to-black/20 z-0" />

        <div className="relative z-10 max-w-5xl w-full px-6 flex flex-col items-center text-white text-center space-y-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 md:p-12 shadow-xl">
            <h1 className="text-3xl md:text-5xl font-bold leading-snug">
              A One-Stop Portal for <br /> Placements & Internships
            </h1>
            <p className="mt-4 text-sm md:text-base text-gray-100 leading-relaxed max-w-2xl mx-auto">
              Welcome to the official recruitment portal of IIITDM Kurnool. Home
              to talented minds and forward thinkers, IIITDM nurtures
              excellence, innovation, and a strong foundation to create future
              leaders in tech and design.
            </p>
          </div>

          <div className="w-full flex flex-col md:flex-row justify-center items-center gap-5">
            <Link to="/student/login" className="w-full md:w-auto">
              <button className="flex items-center justify-center gap-3 w-full md:w-60 py-3 px-6 bg-white/20 border border-white/30 rounded-lg text-white backdrop-blur-md hover:bg-white/30 transition-all shadow-md">
                <img src="/projectV1.png" alt="Student" className="w-5 h-5" />
                Student Login
              </button>
            </Link>
            <Link
              to="https://docs.google.com/forms/d/e/1FAIpQLScmbLuoAeDym_5EhLRUBspbGtLqA5yjahxVJOmuiOK3aCv8gw/viewform"
              className="w-full md:w-auto"
            >
              <button className="flex items-center justify-center gap-3 w-full md:w-60 py-3 px-6 bg-white/20 border border-white/30 rounded-lg text-white backdrop-blur-md hover:bg-white/30 transition-all shadow-md">
                <img src="/rec.png" alt="Recruiter" className="w-5 h-5" />
                Recruiter Login
              </button>
            </Link>

            <Link to="/admin/login" className="w-full md:w-auto">
              <button className="flex items-center justify-center gap-3 w-full md:w-60 py-3 px-6 bg-white/20 border border-white/30 rounded-lg text-white backdrop-blur-md hover:bg-white/30 transition-all shadow-md">
                <img src="/ad.png" alt="Admin" className="w-5 h-5" />
                Admin Login
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* Sections with IDs for scroll */}
      <div className="scroll-mt-24">
        <Broucher />
      </div>

      <div id="overview" className="scroll-mt-24">
        <Cta />
      </div>

      <div id="directors-message" className="scroll-mt-24">
        <Message />
      </div>

      <div id="process" className="scroll-mt-24">
        <PlacementProcess />
      </div>
      <CompanySlider />
      <AdminStaff />
      <Coordinators />
      <div id="contact" className="scroll-mt-24">
        <ContactUs />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
