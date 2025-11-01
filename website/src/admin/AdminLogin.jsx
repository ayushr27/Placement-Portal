import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import "../css/student_login.css";
import { API_URL } from "../../env-config";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLogin() {
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
        toast.error(`❌ ${tokenData.detail || "Login failed"}`);
        setLoading(false);
        return;
      }

      const accessToken = tokenData.access_token;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", "admin");

      const profileRes = await fetch(`${API_URL}/profile/admin/me`, {
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
      toast.success(`✅ Welcome, ${profileData.username || "Admin"}!`);
      navigate(`/admin/${profileData.username}`);
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("❌ Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="flex flex-col md:flex-row min-h-screen">
  <Toaster position="top-right" />

  {/* Left Section */}
  <div className="flex flex-col w-full md:w-1/2 justify-center items-center bg-[#181204] relative overflow-hidden py-10 px-4">
    <div className="z-20 text-center">
      <h1 className="text-white font-bold leading-tight text-[clamp(1.8rem,4vw,3rem)]">
        Welcome to <br />
        <span className="font-extrabold text-[clamp(2.5rem,6vw,4rem)]">
          Admin Portal
        </span>
      </h1>
      <p className="text-gray-300 mt-2 text-sm sm:text-base">
        Login to access your account
      </p>
    </div>

    <img
      className="mt-6 max-h-[220px] sm:max-h-[350px] md:max-h-[500px] w-auto z-30"
      src="/login.png"
      alt="login"
    />
  </div>

  {/* Right Section */}
  <div className="flex-1 bg-white w-full md:w-1/2 flex flex-col justify-start px-6 sm:px-12 py-6 overflow-y-auto">
    <img
      className="w-[120px] sm:w-[180px] mx-auto mb-10 sm:mb-20 mt-6 sm:mt-12"
      src="/logo.webp"
      alt="logo"
    />
    <h2 className="text-xl sm:text-2xl md:text-3xl mx-auto font-bold mb-6">
      Login
    </h2>

    <form
      onSubmit={handleLogin}
      className="flex w-full sm:w-2/3 mx-auto flex-col gap-4 sm:gap-5"
    >
      {/* Username */}
      <input
        type="text"
        placeholder="Username"
        value={Username}
        onChange={(e) => setUsername(e.target.value)}
        className="border-b border-gray-300 focus:outline-none focus:border-black pb-2"
        required
      />

      {/* Password with eye toggle */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={Password}
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

      {/* Login Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-[#181204] text-white py-3 rounded-lg hover:bg-black transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} /> Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      {/* Extra buttons */}
      <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          ⬅ Home
        </button>
        <button
          type="button"
          onClick={() => navigate("/student/login")}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Student Login
        </button>
      </div>
    </form>
  </div>
</div>
  );
}
