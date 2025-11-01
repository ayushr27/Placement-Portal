import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../css/student_login.css";
import { API_URL } from "../../env-config";
import toast, { Toaster } from "react-hot-toast";
import MotionPath from "../components/transition";

export default function StudentLogin() {
  const [Password, setPassword] = useState("");
  const [Username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.clear();
    setLoading(true);
    try {
      const tokenRes = await fetch(`${API_URL}/api/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: Username,
          password: Password,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) {
        toast.error(`${tokenData.detail || "Invalid username or password"}`);
        setLoading(false);
        return;
      }

      const accessToken = tokenData.access_token;
      
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", "student");
      const profileRes = await fetch(`${API_URL}/profile/student/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const profileData = await profileRes.json();
      if (!profileRes.ok) {
        toast.error("Login failed.");
        localStorage.clear();
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(profileData));
      toast.success(`✅ Welcome, ${profileData.username || "User"}!`);
      const student = JSON.parse(localStorage.getItem("user")).name;
      navigate(`/student/${student}`);

    } catch (err) {
      console.error("Login Error:", err);
      toast.error("❌ Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden relative font-[Figtree]">

      {/* --- Fullscreen Loader --- */}
 {loading && (
  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md overflow-hidden">
    {/* Animated Motion Path */}
    <div className="flex items-center justify-center w-full h-full opacity-40">
      <MotionPath />
    </div>

    {/* Center text content */}
    <div className="relative z-10 flex flex-col items-center justify-center">
      <p className="text-white text-2xl sm:text-3xl font-semibold mb-6 animate-pulse drop-shadow-lg">
        Logging you in...
      </p>
      <p className="text-gray-300 text-sm sm:text-base">
        Please wait while we fetch your dashboard
      </p>
    </div>
  </div>
)}


      {/* LEFT SECTION */}
      <div className="flex-1 bg-white flex flex-col justify-center px-8 sm:px-12 py-8">
        <img
          className="w-[160px] sm:w-[200px] mx-auto mb-12 sm:mb-20"
          src="/logo.webp"
          alt="logo"
        />
        <h2 className="text-2xl sm:text-3xl text-center font-bold mb-8">
          Student Login
        </h2>

        <form
          className="flex flex-col gap-5 w-full sm:w-2/3 mx-auto"
          onSubmit={handleLogin}
        >
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            className="border-b border-gray-300 focus:outline-none focus:border-black pb-2"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="border-b border-gray-300 focus:outline-none focus:border-black pb-2 w-full pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500 hover:text-black"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <p className="text-sm text-gray-500 cursor-pointer text-right">
            Forgot Password?
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading 
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-[#181204] hover:bg-black"
            } text-white py-3 rounded-lg transition-all duration-300`}
          >
            Login
          </button>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm sm:text-base"
            >
              ⬅ Home
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/login")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm sm:text-base"
            >
              Admin Login
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT SECTION */}
      <div className="hidden md:flex md:flex-1 justify-center items-center relative overflow-hidden">
        <img
          src="/student_signin.svg"
          alt="students coding together"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="z-20 absolute top-10 text-center px-6">
          <h1 className="text-6xl font-extrabold mb-2 leading-snug drop-shadow-lg">
            Welcome Back
          </h1>
          <p className=" text-xl sm:text-base">
            Connect. Explore. Succeed.        
              </p>
        </div>
      </div>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
}
