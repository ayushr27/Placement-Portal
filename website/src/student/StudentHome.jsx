import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoNav from "../components/LogoNav";
import JobGet from "./JobGet";
import "../css/scroll.css";
import Sidebar from "../components/SideNav";
import { API_URL } from "../../env-config";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const StudentHome = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const tokenRes = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" ,  "Authorization": `Bearer ${token}` },
      body: JSON.stringify({
        old_password: formData.old_password,
        new_password: formData.new_password,
      }),
    });

    if (!tokenRes.ok) {
      const errMsg = await tokenRes.text();
      toast.error(errMsg || "Password update failed ");
      throw new Error(errMsg);
    }

    const updated = await tokenRes.json();
    console.log("Password updated:", updated);

    toast.success("Password updated successfully ");
    setIsModalOpen(false);
    setFormData({ old_password: "", new_password: "" });
  } catch (err) {
    console.error("Update error:", err);
    toast.error("Something went wrong. Try again ");
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/student/login");
  };

  return (
    <div className="h-screen flex bg-[#EEEEEE]">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <LogoNav className="shadow-md sticky top-0 z-10" />

        <div className="flex flex-1 flex-col lg:flex-row gap-6 p-4 md:p-6 overflow-y-auto">
          <div className="flex-1 rounded-3xl md:overflow-y-auto custom-scroll">
            <JobGet />
          </div>

          <div className="w-full lg:w-[280px] flex flex-col gap-6">
            <button
              className="mt-3 w-full bg-white border font-bold border-gray-300 hover:bg-gray-100 rounded-2xl py-2 transition"
              onClick={() => {
                const user = JSON.parse(localStorage.getItem("user"));
                if (user?.email) {
                  const username = user.email.slice(0, user.email.length - 12);
                  navigate(`/student/profile/${username}`);
                } else {
                  console.error("User not found in localStorage");
                }
              }}
            >
              View Profile
            </button>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              {/* Change password */}
              <button
                className="bg-white w-full rounded-2xl p-3 text-lg font-semibold shadow-md cursor-pointer flex items-center gap-3 justify-center hover:shadow-lg hover:scale-105 transition"
                onClick={() => setIsModalOpen(true)}
              >
                🔑 Change Password
              </button>

              {/* Log out */}
              <button
                onClick={handleLogout}
                className="bg-white w-full rounded-2xl p-3 text-lg font-semibold shadow-md cursor-pointer flex items-center gap-3 justify-center hover:shadow-lg hover:scale-105 transition"
              >
                🚪 Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
  {isModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 md:m-0 m-2">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-0 overflow-hidden flex">
      
      {/* Left Side Animation */}
      <div className="hidden md:flex items-center rounded-md justify-center w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600">
  <video
  src="/animation.webm"
  className="w-3/4 rounded-md"
  autoPlay
  loop
  muted
  playsInline
/>
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🔐 Change Password
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Old Password */}
          <div className="relative">
            <label className="text-sm text-gray-600">Old Password</label>
            <input
              type={showOld ? "text" : "password"}
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 mt-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your old password"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
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
              className="border border-gray-300 rounded-lg px-4 py-3 mt-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a new password"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudentHome;
