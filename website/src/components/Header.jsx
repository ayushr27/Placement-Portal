import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/assets/images/iiitdm-logo.png"
              alt="IIITDM Kurnool Logo"
              className="h-12 mr-4"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                IIITDM Kurnool
              </h1>
              <p className="text-sm text-gray-600">Placement Cell</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-800 hover:text-blue-600 font-medium"
            >
              Home
            </Link>
            <Link
              to="/students"
              className="text-gray-800 hover:text-blue-600 font-medium"
            >
              For Students
            </Link>
            <Link
              to="/recruiters"
              className="text-gray-800 hover:text-blue-600 font-medium"
            >
              For Recruiters
            </Link>
            <Link
              to="/contact"
              className="text-gray-800 hover:text-blue-600 font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-800 hover:text-blue-600 font-medium"
            >
              Home
            </Link>
            <Link
              to="/students"
              className="block text-gray-800 hover:text-blue-600 font-medium"
            >
              For Students
            </Link>
            <Link
              to="/recruiters"
              className="block text-gray-800 hover:text-blue-600 font-medium"
            >
              For Recruiters
            </Link>
            <Link
              to="/contact"
              className="block text-gray-800 hover:text-blue-600 font-medium"
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
