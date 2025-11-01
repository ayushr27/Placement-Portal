import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../css/student_login.css";
import { API_URL } from "../../env-config";
import toast, { Toaster } from "react-hot-toast";

export default function StudentLogin() {
  const [Password, setPassword] = useState("");
  const [Username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
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
        toast.error(`❌ ${tokenData.detail || "Invalid username or password"}`);
        setLoading(false);
        return;
      }

      const accessToken = tokenData.access_token;
      localStorage.setItem("token", accessToken);

      const profileRes = await fetch(`${API_URL}/profile/student/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const profileData = await profileRes.json();
      if (!profileRes.ok) {
        toast.error("⚠️ Login succeeded, but failed to fetch profile.");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(profileData));
      toast.success(`✅ Welcome, ${profileData.username || "User"}!`);

      setTimeout(() => navigate(`/student/${profileData.username}`), 1000);
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("❌ Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex-1 bg-white w-1/2 flex flex-col justify-start px-12">
        <img
          className="w-[200px] mx-auto mb-40 mt-20"
          src="/logo.webp"
          alt="logo"
        />
        <h2 className="text-3xl mx-auto font-bold mb-8">Login</h2>
        <form
          className="flex w-2/3 mx-auto flex-col gap-5"
          onSubmit={handleLogin}
        >
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
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

          <p className="text-sm text-gray-500 cursor-pointer">
            Forgot Password?
          </p>
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#181204] hover:bg-black"
            } text-white py-3 rounded-lg transition`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Right Section */}
      <div className="right-section flex flex-col w-1/2 justify-evenly items-center bg-[#181204] relative overflow-hidden">
        <div className="z-20">
          <h1 className="text-white text-5xl font-bold leading-tight">
            Welcome to <br />
            <span className="text-7xl font-extrabold">student portal</span>
          </h1>
          <p className="text-gray-300 mt-2 text-sm">
            Login to access your account
          </p>
        </div>

        <img
          className="w-[500px] md:w-[700px] z-30"
          src="/login.png"
          alt="login"
        />
      </div>

      {/* Toast Container */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
}
