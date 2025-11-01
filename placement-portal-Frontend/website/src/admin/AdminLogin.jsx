import { useState  } from "react";
import { useNavigate } from "react-router-dom"; // Needed for navigation
import React from "react";
import "../css/student_login.css";
import { API_URL } from "../../env-config";

export default function AdminLogin() {
    const [Password, setPassword] = useState("");
    const [Username, setUsername] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

      const handleLogin = async (e) => {
        e.preventDefault();
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
          if (!tokenRes.ok) return alert(`❌ ${tokenData.detail || "Login failed"}`);
    
          const accessToken = tokenData.access_token;
          localStorage.setItem("token", accessToken);
    
          const profileRes = await fetch(`${API_URL}/profile/admin/me`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          });
    
          const profileData = await profileRes.json();
          if (!profileRes.ok)
            return alert("⚠️ Login succeeded, but failed to fetch profile.");
    
          localStorage.setItem("user", JSON.stringify(profileData));
          alert(`✅ Welcome, ${profileData.username || "User"}!`);
          navigate(`/admin/${profileData.username}`);
        } catch (err) {
          console.error("Login Error:", err);
          alert("❌ Server error. Please try again.");
        }
      };

  return (
    <div className="flex h-screen ">
      {/* Left Section */}
 
      {/* Right Section */}
      <div className="right-section flex flex-col w-1/2 justify-evenly items-center bg-[#181204] relative overflow-hidden">

        {/* Welcome Text - exact position */}
        <div className=" z-20">
          <h1 className="text-white text-5xl font-bold leading-tight">
            Welcome to <br />
            <span className=" text-7xl font-extrabold ">Admin portal</span>
          </h1>
          <p className="text-gray-300 mt-2 text-sm">
            Login to access your account
          </p>
        </div>

        {/* Illustration Placeholder */}
        <img className="w-[500px] md:w-[700px] z-30" src="/login.png" alt="login" />
      </div>
        <svg width="297" className="vector1 " height="274" viewBox="0 0 297 274" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M61.3073 29.0586C88.2219 6.40331 123.623 1.39297 158.797 0.723607C190.998 0.110826 224.821 3.53503 248.377 25.4986C271.085 46.6717 270.217 80.1536 276.577 110.543C284.477 148.289 308.691 187.757 289.316 221.101C268.574 256.8 223.355 271.04 182.12 273.109C142.251 275.109 106.28 256.102 74.5541 231.875C40.7509 206.062 2.99212 176.647 0.22008 134.205C-2.5263 92.1563 29.0695 56.1946 61.3073 29.0586Z" fill="#F0F0F0" fill-opacity="0.43" />
        </svg>
        <svg className="vector2 " width="297" height="222" viewBox="0 0 297 222" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M61.3073 -22.9419C88.2219 -45.5972 123.623 -50.6075 158.797 -51.2769C190.998 -51.8897 224.821 -48.4654 248.377 -26.5019C271.085 -5.32876 270.217 28.1531 276.577 58.5422C284.477 96.2888 308.691 135.756 289.316 169.101C268.574 204.799 223.355 219.04 182.12 221.108C142.251 223.108 106.28 204.102 74.5541 179.875C40.7509 154.062 2.99212 124.646 0.220078 82.2046C-2.5263 40.1558 29.0695 4.19407 61.3073 -22.9419Z" fill="#C89945" fill-opacity="0.6" />
        </svg>

        <svg className="vector3 " width="177" height="201" viewBox="0 0 177 201" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M105.811 4.5008C134.858 5.34946 166.738 -2.11863 188.758 16.8444C211.719 36.6192 219.208 69.6126 216.458 99.7907C213.923 127.614 195.618 150.135 174.904 168.883C155.442 186.498 132.001 198.163 105.811 199.94C77.5003 201.86 47.1208 198.603 26.6614 178.941C5.91888 159.006 3.1149 128.52 1.6037 99.7907C-0.0241652 68.8436 -4.99758 32.7644 17.8723 11.8517C40.439 -8.78384 75.2452 3.60776 105.811 4.5008Z" fill="#C89945" fill-opacity="0.6" />
        </svg>

        <svg className="vector4 " width="422" height="389" viewBox="0 0 422 389" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M205.374 8.7358C261.752 10.383 323.63 -4.11215 366.368 32.694C410.935 71.0758 425.47 135.114 420.133 193.688C415.212 247.692 379.683 291.403 339.479 327.793C301.705 361.983 256.206 384.623 205.374 388.072C150.424 391.8 91.4587 385.477 51.7483 347.313C11.4882 308.621 6.04585 249.45 3.1127 193.688C-0.0469024 133.622 -9.70001 63.5939 34.6891 23.0034C78.4897 -17.0489 146.047 7.00245 205.374 8.7358Z" fill="#C89945" />
        </svg>

        <svg className="vector5 " width="763" height="616" viewBox="0 0 763 616" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M467.006 132.596C583.471 80.0013 685.35 -14.6836 812.005 2.31079C960.633 22.2535 1115.18 93.6589 1181.01 228.4C1246.57 362.608 1189.14 518.749 1131.66 656.612C1079.22 782.362 998.913 894.871 877.418 956.524C755.024 1018.63 617.337 1011.37 482.441 986.056C317.591 955.124 116.62 945.835 36.1559 798.67C-45.1052 650.048 24.3375 458.696 116.336 316.47C190.857 201.265 341.959 189.067 467.006 132.596Z" fill="#C89945" fill-opacity="0.5" />
        </svg>

        <svg className="vector6 " width="402" height="342" viewBox="0 0 402 342" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M246.183 -104.329C312.639 -116.256 371.52 -62.0773 418.718 -13.7965C465.269 33.8225 509.63 92.4428 503.35 158.738C497.371 221.846 441.487 266.079 388.857 301.412C346.913 329.57 296.568 327.713 246.183 331.386C189.06 335.551 127.863 356.88 81.0709 323.851C29.1946 287.233 -8.32216 221.457 1.5951 158.738C10.9568 99.5328 85.3425 82.6115 126.158 38.7128C170.216 -8.67467 182.496 -92.898 246.183 -104.329Z" fill="#C89945" />
        </svg>

    <div className="flex-1 bg-white w-1/2 flex z-100 flex-col justify-start px-12">
      <img className='w-[200px] mx-auto mb-40 mt-20' src="/logo.webp" alt="logo" />
        <h2 className="text-3xl mx-auto font-bold mb-8">Login</h2>
        <form onSubmit={handleLogin} className="flex w-2/3 mx-auto flex-col gap-5">
          <input
            type="text"
            placeholder="Username"
            onChange={(e)=>{
                setUsername(e.target.value);
            }}
            className="border-b border-gray-300 focus:outline-none focus:border-black pb-2"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e)=>{
                setPassword(e.target.value);
            }}
            className="border-b border-gray-300 focus:outline-none focus:border-black pb-2"
          />
          <p className="text-sm text-gray-500 cursor-pointer">
            Forgot Password?
          </p>
          <button
            type="submit"
            className="bg-[#181204] text-white py-3 rounded-lg hover:bg-black transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

