import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LogoNav from "../components/LogoNav";
import JobGet from "./JobGet";
import Sidebar from "../components/SideNav";
import { API_URL } from "../../env-config.mjs";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff, Key, LogOut, User } from "lucide-react";
import "../css/scroll.css";

const StudentHome = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ old_password: "", new_password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errMsg = await res.text();
      toast.error(errMsg || "Password update failed");
      throw new Error(errMsg);
    }

    toast.success("Password updated successfully");
    setIsModalOpen(false);
    setFormData({ old_password: "", new_password: "" });
  } catch (err) {
    toast.error("Something went wrong. Try again");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const handleLogout = () => {
    ["token", "user", "role"].forEach((key) => localStorage.removeItem(key));
    navigate("/student/login");
  };

  const goToProfile = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      const username = user.email.replace(/@.*$/, "");
      navigate(`/student/profile/${username}`);
    } else console.error("User not found");
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <LogoNav className={`sticky top-0 z-20 transition-all ${isScrolled ? "shadow-md bg-white/90 backdrop-blur" : ""}`} />

        <div className="flex flex-1 flex-col lg:flex-row gap-6 p-4 md:p-6 overflow-y-auto">
          {/* Jobs Section */}
  <div className="flex-1 rounded-3xl bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition custom-scroll"> 
    <JobGet /> 
    </div>
          {/* Actions / Sidebar */}
          <div className="w-full lg:w-[280px] flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-white p-3 rounded-2xl shadow-md font-bold hover:shadow-lg text-gray-800 transition"
              onClick={goToProfile}
            >
              <User className="w-5 h-5 text-blue-500" />
              View Profile
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95, rotate: -2 }}
              className="flex items-center justify-center gap-2 bg-white p-3 rounded-2xl shadow-md font-semibold hover:shadow-lg transition text-green-600"
              onClick={() => setIsModalOpen(true)}
            >
              <Key className="w-5 h-5" /> Change Password
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95, rotate: -2 }}
              className="flex items-center justify-center gap-2 bg-white p-3 rounded-2xl shadow-md font-semibold hover:shadow-lg transition text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" /> Log Out
            </motion.button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-0"
          >
            <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center">
                <video src="/animation.webm" className="w-3/4 rounded-md" autoPlay loop muted playsInline />
              </div>
              <div className="w-full md:w-1/2 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔐 Change Password</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Old Password */}
                  <div className="relative">
                    <label className="text-sm text-gray-600">Old Password</label>
                    <input
                      type={showOld ? "text" : "password"}
                      name="old_password"
                      value={formData.old_password}
                      onChange={handleChange}
                      placeholder="Enter your old password"
                      className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-700">
                      {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <label className="text-sm text-gray-600">New Password</label>
                    <input
                      type={showNew ? "text" : "password"}
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleChange}
                      placeholder="Enter a new password"
                      className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-700">
                      {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Buttons */}
              <motion.button
                type="submit"
                className={`px-5 py-2.5 rounded-lg text-white font-medium shadow-md ${
                  loading ? "bg-blue-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } flex items-center justify-center gap-2`}
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                disabled={loading}
              >
                {loading && (
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
                {loading ? "Updating..." : "Save"}
              </motion.button>
                 <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudentHome;
