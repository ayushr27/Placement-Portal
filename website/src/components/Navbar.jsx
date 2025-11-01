import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ className = "" ,navcol}) {
  const [isOpen, setIsOpen] = useState(false);

  const linkStyle =
    "block md:inline hover:text-gray-200 px-2 py-1 transition-colors duration-200";
  const activeStyle = "text-gray-300 underline";

  return (
    <nav
      className={`p-4 flex justify-between backdrop-blur-2xl items-center flex-wrap fixed top-0 w-full transition-all duration-300 z-50 ${className}`}
    >
      {/* Logo and Title */}
      <a href="#" className="flex items-center text-white text-lg font-bold">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/5/5f/Indian_Institute_of_Information_Technology_Design_and_Manufacturing%2C_Kurnool_logo.png"
          alt="IIITDM Kurnool"
          className="h-10 w-10 mr-2"
        />
        <p className="md:block hidden">Training and Placement Cell, <span className={navcol}>IIITDM Kurnool</span></p>
      </a>

      <button
        className="text-white md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } w-full md:flex md:items-center md:w-auto md:space-x-3 text-white font-bold md:mr-5 mt-4 md:mt-0`}
      >
        <a href="#overview" className={linkStyle}>
          Overview
        </a>
        <a href="#why-recruit" className={linkStyle}>
          Why Recruit
        </a>
        <a href="#directors-message" className={linkStyle}>
          Leadership Messages
        </a>
        <a href="#process" className={linkStyle}>
          Placement Process
        </a>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLScmbLuoAeDym_5EhLRUBspbGtLqA5yjahxVJOmuiOK3aCv8gw/viewform">
          Recuriter Form
        </a>
        <a href="#contact" className={linkStyle}>
          Contact Us
        </a>
      </div>
    </nav>
  );
}
