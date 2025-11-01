import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  ExternalLink,
  Menu,
  X,
  Settings,
  Bell,
  Info,
  LogOut,
  User,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LogoNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || "student";

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavigation = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const menuItems =
    role === "admin"
      ? [
          {
            icon: Home,
            label: "Dashboard",
            dest: `/admin/${user.name}`,
            external: false,
          },
          {
            icon: Users,
            label: "Student Management",
            dest: "/admin/management",
            external: false,
          },
          // {
          //   icon: Briefcase,
          //   label: "Job Postings",
          //   dest: "/admin/jobs",
          //   external: false,
          // },
          // {
          //   icon: Users,
          //   label: "Our Team",
          //   dest: "/admin/team",
          //   external: false,
          // },
          // {
          //   icon: Settings,
          //   label: "Settings",
          //   dest: "/admin/settings",
          //   external: false,
          // },
          {
            icon: FileText,
            label: "Placement Site",
            dest: "/",
            external: false,
          },
          {
            icon: ExternalLink,
            label: "Institute Site",
            dest: "https://iiitk.ac.in/",
            external: true,
          },
        ]
      : [
          {
            icon: Home,
            label: "Dashboard",
            dest: `/student/${user.name}`,
            external: false,
          },
          {
            icon: Users,
            label: "Profile",
            dest: `/student/profile/${user.roll_number}`,
            external: false,
          },
          {
            icon: Briefcase,
            label: "Available Jobs",
            dest: "/student/jobs",
            external: false,
          },
          {
            icon: Bell,
            label: "Notifications",
            dest: "/student/notifications",
            external: false,
          },
          {
            icon: Info,
            label: "Placement Process",
            dest: "/student/process",
            external: false,
          },
          {
            icon: ExternalLink,
            label: "Institute Site",
            dest: "https://iiitk.ac.in/",
            external: true,
          },
        ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMenuItemClick = () => {
    closeMobileMenu();
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <div className="w-full flex justify-center relative px-4 sm:px-6">
        <nav className="flex justify-between w-full max-w-7xl items-center gap-4 px-4 sm:px-6 py-3 mt-3 sm:mt-5 rounded-full bg-white shadow-2xl relative">
          {/* Left side - Hamburger Menu (Mobile only) */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo and Title - Centered */}
          <div className="flex items-center mx-auto gap-3 flex-1 md:flex-none justify-center md:justify-start">
            <img
              className="w-10 sm:w-12 drop-shadow-lg"
              src="/logo.webp"
              alt="logo"
            />
            <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 whitespace-nowrap">
              {isMobile ? "" : "Training & Placement Cell, IIITDM Kurnool"}
            </span>
          </div>

          {/* Desktop Navigation Items (Right side) */}
        {/* <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <User size={16} />
              <span>{role === "admin" ? "Admin" : user.name || "Student"}</span>
            </div>
            
          </div>   */}

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-4 right-4 mt-2 bg-white shadow-2xl rounded-2xl p-4 z-50 border border-gray-200"
              >
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                  <img
                    src="/profile.png"
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {role === "admin" ? "Admin" : user.name || "Student"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {role === "admin" ? "Administrator" : "Student"}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className="space-y-1">
                  {menuItems.map(({ icon: Icon, label, dest, external }, idx) =>
                    external ? (
                      <a
                        key={idx}
                        href={dest}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleMenuItemClick}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors group"
                      >
                        <Icon size={20} className="text-gray-700 group-hover:text-purple-600" />
                        <span className="text-gray-700 font-medium group-hover:text-purple-600">
                          {label}
                        </span>
                      </a>
                    ) : (
                      <Link
                        to={dest}
                        key={idx}
                        onClick={handleMenuItemClick}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors group"
                      >
                        <Icon size={20} className="text-gray-700 group-hover:text-purple-600" />
                        <span className="text-gray-700 font-medium group-hover:text-purple-600">
                          {label}
                        </span>
                      </Link>
                    )
                  )}
                </nav>

                {/* Logout Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleMenuItemClick();
                      handleNavigation();
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors font-medium"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default LogoNav;