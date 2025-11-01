import { useState, useEffect } from "react";
import Sidebar from "../components/SideNav";
import LogoNav from "../components/LogoNav";
import JobPost from "./JobPost";
import "../css/scroll.css";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../../env-config";

const AdminHome = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [Modal, setModal] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, data } = e.target();
    setFormData((prev) => ({ ...prev, [name]: data }));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await fetch(API_URL + "/register/upload-csv", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to upload CSV");
      }

      toast.success("CSV uploaded successfully ");
      setModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error uploading CSV ");
    }
  };

  return (
    <div className="h-screen flex bg-[#EEEEEE]">
      {/* Sidebar - collapses on small screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <LogoNav className="shadow-md sticky top-0 z-10" />
        <div className="flex flex-1 flex-col lg:flex-row gap-6 p-4 md:p-6 overflow-y-auto">
          {/* Job Post Section */}
          <div className="flex-1 rounded-3xl md:overflow-y-auto custom-scroll">
            <JobPost />
          </div>

          {/* Right Side Actions */}
          <div className="w-full lg:w-[280px] hidden flex-col justify-evenly items-center lg:flex gap-4">
            {/* Update Brochure */}
            <NavLink to="/admin/management">
              <button className="relative w-60 h-60 bg-gradient-to-br from-orange-400 to-red-500 cursor-pointer rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
                <svg
                  className="absolute w-[120px] -left-3.5 top-1"
                  viewBox="0 0 127 74"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M51.6083 50.8609C51.6083 63.5043 40.0554 73.7539 25.8041 73.7539C11.5529 73.7539 0 63.5043 0 50.8609C0 44.1948 3.21144 38.1942 8.33661 34.0103C12.9323 30.2587 19.0667 27.9678 25.8041 27.9678C40.0554 27.9678 51.6083 38.2174 51.6083 50.8609Z"
                    fill="#D15842"
                  />
                  <path
                    d="M126.081 50.8609C126.081 63.5043 114.528 73.7539 100.277 73.7539C86.0255 73.7539 74.4726 63.5043 74.4726 50.8609C74.4726 49.2458 74.6611 47.6699 75.0196 46.1493C77.4681 35.7661 87.8459 27.9678 100.277 27.9678C114.528 27.9678 126.081 38.2174 126.081 50.8609Z"
                    fill="#D15842"
                  />
                  <path
                    d="M97.102 23.4926C97.102 35.0148 87.5074 44.5489 75.0196 46.1493C73.8044 46.305 72.5618 46.3857 71.2979 46.3857C58.7729 46.3857 48.3322 38.4688 45.9866 27.9678C45.6633 26.5205 45.4938 25.0242 45.4938 23.4926C45.4938 21.4812 45.7861 19.5304 46.3353 17.6718C49.2379 7.84744 59.3138 0.599609 71.2979 0.599609C85.5491 0.599609 97.102 10.8492 97.102 23.4926Z"
                    fill="#D15842"
                  />
                  <path
                    d="M51.6083 50.8609C51.6083 63.5043 40.0554 73.7539 25.8041 73.7539H100.277C86.0255 73.7539 74.4726 63.5043 74.4726 50.8609C74.4726 49.2458 74.6611 47.6699 75.0196 46.1493C73.8044 46.305 72.5618 46.3857 71.2979 46.3857C58.7729 46.3857 48.3322 38.4688 45.9866 27.9678H29.1544H25.8041C40.0554 27.9678 51.6083 38.2174 51.6083 50.8609Z"
                    fill="#D15842"
                  />
                  <path
                    d="M45.9866 27.9678C45.6633 26.5205 45.4938 25.0242 45.4938 23.4926C45.4938 21.4812 45.7861 19.5304 46.3353 17.6718C44.179 21.1038 37.724 27.9678 29.1544 27.9678H45.9866Z"
                    fill="#D15842"
                  />
                </svg>

                <svg
                  width="85"
                  height="49"
                  className="absolute top-6 right-5"
                  viewBox="0 0 85 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M35.0421 33.8023C35.0421 42.1762 27.3905 48.9647 17.9517 48.9647C8.51296 48.9647 0.861328 42.1762 0.861328 33.8023C0.861328 29.3873 2.98831 25.413 6.38277 22.642C9.42653 20.1572 13.4894 18.64 17.9517 18.64C27.3905 18.64 35.0421 25.4284 35.0421 33.8023Z"
                    fill="#D15842"
                  />
                  <path
                    d="M84.3662 33.8023C84.3662 42.1762 76.7146 48.9647 67.2758 48.9647C57.837 48.9647 50.1854 42.1762 50.1854 33.8023C50.1854 32.7327 50.3103 31.6889 50.5477 30.6818C52.1694 23.8049 59.0427 18.64 67.2758 18.64C76.7146 18.64 84.3662 25.4284 84.3662 33.8023Z"
                    fill="#D15842"
                  />
                  <path
                    d="M65.1732 15.676C65.1732 23.3073 58.8185 29.6218 50.5477 30.6818C49.7429 30.7849 48.9199 30.8383 48.0828 30.8383C39.7874 30.8383 32.8723 25.5949 31.3188 18.64C31.1047 17.6814 30.9924 16.6903 30.9924 15.676C30.9924 14.3438 31.186 13.0518 31.5497 11.8208C33.4722 5.314 40.1456 0.513672 48.0828 0.513672C57.5216 0.513672 65.1732 7.30208 65.1732 15.676Z"
                    fill="#D15842"
                  />
                  <path
                    d="M35.0421 33.8023C35.0421 42.1762 27.3905 48.9647 17.9517 48.9647H67.2758C57.837 48.9647 50.1854 42.1762 50.1854 33.8023C50.1854 32.7327 50.3103 31.6889 50.5477 30.6818C49.7429 30.7849 48.9199 30.8383 48.0828 30.8383C39.7874 30.8383 32.8723 25.5949 31.3188 18.64H20.1706H17.9517C27.3905 18.64 35.0421 25.4284 35.0421 33.8023Z"
                    fill="#D15842"
                  />
                  <path
                    d="M31.3188 18.64C31.1047 17.6814 30.9924 16.6903 30.9924 15.676C30.9924 14.3438 31.186 13.0518 31.5497 11.8208C30.1216 14.0939 25.8464 18.64 20.1706 18.64H31.3188Z"
                    fill="#D15842"
                  />
                </svg>

                <div className="absolute bottom-2 right-2 w-20 h-20 bg-red-600/20 rounded-full"></div>
                <div className="relative z-10 flex flex-col items-start justify-end h-full p-6">
                  <h3 className="text-white text-left text-3xl font-bold leading-tight">
                    Student
                    <br />
                    Management
                  </h3>
                </div>
              </button>
            </NavLink>
            <div className="flex w-full justify-evenly items-start">
              {/* csv upload */}
              <button
                className="relative w-60 h-60 bg-gradient-to-br from-sky-400 to-blue-600 cursor-pointer rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => {
                  setModal(true);
                }}
              >
                <svg
                  className="absolute w-[120px] -left-3.5 top-1"
                  viewBox="0 0 127 74"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M51.6083 50.8609C51.6083 63.5043 40.0554 73.7539 25.8041 73.7539C11.5529 73.7539 0 63.5043 0 50.8609C0 44.1948 3.21144 38.1942 8.33661 34.0103C12.9323 30.2587 19.0667 27.9678 25.8041 27.9678C40.0554 27.9678 51.6083 38.2174 51.6083 50.8609Z"
                    fill="#1565C0"
                  />
                  <path
                    d="M126.081 50.8609C126.081 63.5043 114.528 73.7539 100.277 73.7539C86.0255 73.7539 74.4726 63.5043 74.4726 50.8609C74.4726 49.2458 74.6611 47.6699 75.0196 46.1493C77.4681 35.7661 87.8459 27.9678 100.277 27.9678C114.528 27.9678 126.081 38.2174 126.081 50.8609Z"
                    fill="#1565C0"
                  />
                  <path
                    d="M97.102 23.4926C97.102 35.0148 87.5074 44.5489 75.0196 46.1493C73.8044 46.305 72.5618 46.3857 71.2979 46.3857C58.7729 46.3857 48.3322 38.4688 45.9866 27.9678C45.6633 26.5205 45.4938 25.0242 45.4938 23.4926C45.4938 21.4812 45.7861 19.5304 46.3353 17.6718C49.2379 7.84744 59.3138 0.599609 71.2979 0.599609C85.5491 0.599609 97.102 10.8492 97.102 23.4926Z"
                    fill="#1565C0"
                  />
                  <path
                    d="M51.6083 50.8609C51.6083 63.5043 40.0554 73.7539 25.8041 73.7539H100.277C86.0255 73.7539 74.4726 63.5043 74.4726 50.8609C74.4726 49.2458 74.6611 47.6699 75.0196 46.1493C73.8044 46.305 72.5618 46.3857 71.2979 46.3857C58.7729 46.3857 48.3322 38.4688 45.9866 27.9678H29.1544H25.8041C40.0554 27.9678 51.6083 38.2174 51.6083 50.8609Z"
                    fill="#1565C0"
                  />
                  <path
                    d="M45.9866 27.9678C45.6633 26.5205 45.4938 25.0242 45.4938 23.4926C45.4938 21.4812 45.7861 19.5304 46.3353 17.6718C44.179 21.1038 37.724 27.9678 29.1544 27.9678H45.9866Z"
                    fill="#1565C0"
                  />
                </svg>

                <svg
                  width="85"
                  height="49"
                  className="absolute top-6 right-5"
                  viewBox="0 0 85 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M35.0421 33.8023C35.0421 42.1762 27.3905 48.9647 17.9517 48.9647C8.51296 48.9647 0.861328 42.1762 0.861328 33.8023C0.861328 29.3873 2.98831 25.413 6.38277 22.642C9.42653 20.1572 13.4894 18.64 17.9517 18.64C27.3905 18.64 35.0421 25.4284 35.0421 33.8023Z"
                    fill="#D15842"
                  />
                  <path
                    d="M84.3662 33.8023C84.3662 42.1762 76.7146 48.9647 67.2758 48.9647C57.837 48.9647 50.1854 42.1762 50.1854 33.8023C50.1854 32.7327 50.3103 31.6889 50.5477 30.6818C52.1694 23.8049 59.0427 18.64 67.2758 18.64C76.7146 18.64 84.3662 25.4284 84.3662 33.8023Z"
                    fill="#D15842"
                  />
                  <path
                    d="M65.1732 15.676C65.1732 23.3073 58.8185 29.6218 50.5477 30.6818C49.7429 30.7849 48.9199 30.8383 48.0828 30.8383C39.7874 30.8383 32.8723 25.5949 31.3188 18.64C31.1047 17.6814 30.9924 16.6903 30.9924 15.676C30.9924 14.3438 31.186 13.0518 31.5497 11.8208C33.4722 5.314 40.1456 0.513672 48.0828 0.513672C57.5216 0.513672 65.1732 7.30208 65.1732 15.676Z"
                    fill="#D15842"
                  />
                  <path
                    d="M35.0421 33.8023C35.0421 42.1762 27.3905 48.9647 17.9517 48.9647H67.2758C57.837 48.9647 50.1854 42.1762 50.1854 33.8023C50.1854 32.7327 50.3103 31.6889 50.5477 30.6818C49.7429 30.7849 48.9199 30.8383 48.0828 30.8383C39.7874 30.8383 32.8723 25.5949 31.3188 18.64H20.1706H17.9517C27.3905 18.64 35.0421 25.4284 35.0421 33.8023Z"
                    fill="#D15842"
                  />
                  <path
                    d="M31.3188 18.64C31.1047 17.6814 30.9924 16.6903 30.9924 15.676C30.9924 14.3438 31.186 13.0518 31.5497 11.8208C30.1216 14.0939 25.8464 18.64 20.1706 18.64H31.3188Z"
                    fill="#D15842"
                  />
                </svg>
                <svg
                  width="85"
                  height="49"
                  className="absolute top-6 right-5"
                  viewBox="0 0 85 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M35.0421 33.8023C35.0421 42.1762 27.3905 48.9647 17.9517 48.9647C8.51296 48.9647 0.861328 42.1762 0.861328 33.8023C0.861328 29.3873 2.98831 25.413 6.38277 22.642C9.42653 20.1572 13.4894 18.64 17.9517 18.64C27.3905 18.64 35.0421 25.4284 35.0421 33.8023Z"
                    fill="#1565C0"
                  />
                  <path
                    d="M84.3662 33.8023C84.3662 42.1762 76.7146 48.9647 67.2758 48.9647C57.837 48.9647 50.1854 42.1762 50.1854 33.8023C50.1854 32.7327 50.3103 31.6889 50.5477 30.6818C52.1694 23.8049 59.0427 18.64 67.2758 18.64C76.7146 18.64 84.3662 25.4284 84.3662 33.8023Z"
                    fill="#1565C0"
                  />
                  <path
                    d="M65.1732 15.676C65.1732 23.3073 58.8185 29.6218 50.5477 30.6818C49.7429 30.7849 48.9199 30.8383 48.0828 30.8383C39.7874 30.8383 32.8723 25.5949 31.3188 18.64C31.1047 17.6814 30.9924 16.6903 30.9924 15.676C30.9924 14.3438 31.186 13.0518 31.5497 11.8208C33.4722 5.314 40.1456 0.513672 48.0828 0.513672C57.5216 0.513672 65.1732 7.30208 65.1732 15.676Z"
                    fill="#1565C0"
                  />
                  <path
                    d="M35.0421 33.8023C35.0421 42.1762 27.3905 48.9647 17.9517 48.9647H67.2758C57.837 48.9647 50.1854 42.1762 50.1854 33.8023C50.1854 32.7327 50.3103 31.6889 50.5477 30.6818C49.7429 30.7849 48.9199 30.8383 48.0828 30.8383C39.7874 30.8383 32.8723 25.5949 31.3188 18.64H20.1706H17.9517C27.3905 18.64 35.0421 25.4284 35.0421 33.8023Z"
                    fill="#1565C0"
                  />
                  <path
                    d="M31.3188 18.64C31.1047 17.6814 30.9924 16.6903 30.9924 15.676C30.9924 14.3438 31.186 13.0518 31.5497 11.8208C30.1216 14.0939 25.8464 18.64 20.1706 18.64H31.3188Z"
                    fill="#1565C0"
                  />
                </svg>

                <div className="absolute bottom-2 right-2 w-20 h-20 bg-red-600/20 rounded-full"></div>
                <div className="relative z-10 flex flex-col items-start justify-end h-full p-6">
                  <h3 className="text-white text-left text-3xl font-bold leading-tight">
                    Add
                    <br />
                    Student
                    <br />
                    CSV
                  </h3>
                </div>
              </button>
            </div>

            {/* Logout Button */}
            {/* <button
              className="flex items-center gap-2 bg-red-500 text-white rounded-2xl px-6 py-3 shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
              onClick={() => {
                localStorage.clear();
                navigate("/admin/login");
              }}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button> */}
          </div>
        </div>
      </div>
      {/* modal here */}
      {Modal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 z-121 transition-all duration-300">
    <div className="relative bg-white text-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg p-8 transform scale-100 animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={() => setModal(false)}
        className="absolute top-4 right-4 text-black hover:text-gray-800 dark:hover:text-gray-800 transition-colors"
      >
        ✕
      </button>

      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-black mb-6 text-center">
        Upload Your CSV File
      </h2>
      <p className="text-sm text-gray-500 dark:text-black mb-8 text-center">
        Easily import your data with a clean and formatted CSV file.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 hover:border-blue-500 transition-all cursor-pointer bg-gray-50 dark:bg-gray-900/30">
          <label className="flex flex-col items-center space-y-2 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 16v-8m0 0l-3 3m3-3l3 3m6 5a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-600 dark:text-black font-medium">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-black">.csv only (max 5MB)</span>
            <input
              type="file"
              accept=".csv"
              name="csv_file"
              onChange={(e) =>
                setFormData({ ...formData, csv_file: e.target.files[0] })
              }
              className="hidden"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setModal(false)}
            className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      ;
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default AdminHome;