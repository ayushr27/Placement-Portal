import React, { useState } from "react";
import { Home, FileText, Settings, Bell, Info, Users, Menu, X } from "lucide-react";

const LogoNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="w-full flex justify-center relative px-6">
      <nav className="flex justify-between md:justify-center w-[100%] items-center gap-3 px-4 sm:p-4 py-2 mt-3 sm:mt-5 rounded-full bg-white shadow-2xl relative">
        {/* Left side - Hamburger (Mobile only) */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            className="w-[40px] sm:w-[60px] drop-shadow-lg"
            src="/logo.webp"
            alt="logo"
          />
          <span className="hidden md:inline text-2xl lg:text-3xl text-gray-900">
            Training and Placement Cell, IIITDM Kurnool
          </span>
        </div>
      </nav>

      {/* Dropdown Menu (Mobile only) */}
      {menuOpen && (
        <div className="absolute top-[70px] left-4 right-4 bg-white shadow-2xl rounded-2xl p-4 md:hidden z-50">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Home size={22} />
            <span>Home</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <FileText size={22} />
            <span>Update Brochure</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Settings size={22} />
            <span>Page Control</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Bell size={22} />
            <span>Notifications</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Info size={22} />
            <span>Info</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Users size={22} />
            <span>Users</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoNav;
