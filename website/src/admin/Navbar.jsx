import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const linkStyle =
    "block md:inline hover:text-gray-200 px-2 py-1 transition-colors duration-200";
  const activeStyle = "text-gray-300 underline";

  return (
    <nav
      className={`p-4 flex justify-between items-center flex-wrap fixed top-0 w-full transition-all duration-300 z-50 ${className}`}
    >
      <div className="flex items-center text-white text-lg font-bold">
        <img
          src="/logo.webp"
          alt="IIITDM Kurnool"
          className="h-10 w-10 mr-2"
        />
        <p className="md:block hidden">Placement Cell, IIITDM Kurnool</p>
      </div>

      <button
        className="text-white md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } w-full md:flex md:items-center md:w-auto md:space-x-6 text-white font-bold md:mr-10 mt-4 md:mt-0`}
      >
        <a href="#dashboard" className={linkStyle}>
          Dashboard
        </a>
        <a href="#job-postings" className={linkStyle}>
          Job Postings
        </a>
        <a href="#student-management" className={linkStyle}>
          Student Management
        </a>
        <a href="#profile" className={linkStyle}>
          Profile
        </a>
      </div>
    </nav>
  );
}
