import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./SideNav";
import LogoNav from "../components/LogoNav";
import JobGet from "./JobGet";
import "../css/scroll.css";

const StudentHome = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove auth token
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="h-screen flex bg-[#EEEEEE]">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <LogoNav className="shadow-md sticky top-0 z-10" />

        <div className="flex flex-1 flex-col lg:flex-row gap-6 p-4 md:p-6 overflow-y-auto">
          {/* Job Section */}
          <div className="flex-1 rounded-3xl md:overflow-y-auto custom-scroll">
            <JobGet />
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-[280px] flex flex-col gap-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden text-center">
              <div className="h-20 bg-[#DED9D9] relative"></div>
              <img
                src="https://i.pravatar.cc/150?img=5"
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto -mt-12 border-4 border-white shadow-md"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Mika Kunisaki</h3>
                <button className="mt-3 w-full bg-white border font-bold border-gray-300 hover:bg-gray-100 rounded-2xl py-2 transition">
                  View Profile
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              {/* Change password */}
              <button className="bg-white w-full rounded-2xl p-3 text-lg font-semibold shadow-md cursor-pointer flex items-center gap-3 justify-center hover:shadow-lg hover:scale-105 transition">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.9507 30.5798C10.577 29.8731 8.46412 28.5611 6.79108 26.8226C7.41522 26.0829 7.79134 25.1271 7.79134 24.0835C7.79134 21.7363 5.88855 19.8335 3.54134 19.8335C3.39936 19.8335 3.25899 19.8406 3.12058 19.8542C2.93203 18.9323 2.83301 17.9779 2.83301 17.0002C2.83301 15.5194 3.06022 14.0916 3.48169 12.7498C3.50154 12.7501 3.52142 12.7502 3.54134 12.7502C5.88855 12.7502 7.79134 10.8474 7.79134 8.50022C7.79134 7.82638 7.63452 7.18923 7.35543 6.62314C8.99374 5.09979 10.9934 3.95974 13.2116 3.3457C13.9145 4.72345 15.3469 5.6669 16.9997 5.6669C18.6524 5.6669 20.0849 4.72345 20.7878 3.3457C23.006 3.95974 25.0056 5.09979 26.6439 6.62314C26.3648 7.18923 26.208 7.82638 26.208 8.50022C26.208 10.8474 28.1108 12.7502 30.458 12.7502C30.4779 12.7502 30.4978 12.7501 30.5177 12.7498C30.9391 14.0916 31.1663 15.5194 31.1663 17.0002C31.1663 17.9779 31.0673 18.9323 30.8788 19.8542C30.7404 19.8406 30.6 19.8335 30.458 19.8335C28.1108 19.8335 26.208 21.7363 26.208 24.0835C26.208 25.1271 26.5841 26.0829 27.2082 26.8226C25.5352 28.5611 23.4223 29.8731 21.0487 30.5798C20.5008 28.8661 18.8952 27.6252 16.9997 27.6252C15.1042 27.6252 13.4985 28.8661 12.9507 30.5798Z"
                    fill="#2F88FF"
                    stroke="black"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M16.9993 21.9587C19.7378 21.9587 21.9577 19.7387 21.9577 17.0003C21.9577 14.2619 19.7378 12.042 16.9993 12.042C14.2609 12.042 12.041 14.2619 12.041 17.0003C12.041 19.7387 14.2609 21.9587 16.9993 21.9587Z"
                    fill="#43CCF8"
                    stroke="white"
                    strokeWidth="1.2"
                  />
                </svg>
                Change Password
              </button>

              {/* Log out */}
              <button
                onClick={handleLogout}
                className="bg-white w-full rounded-2xl p-3 text-lg font-semibold shadow-md cursor-pointer flex items-center gap-3 justify-center hover:shadow-lg hover:scale-105 transition"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.64286 0C2.67671 0 1.75014 0.3838 1.06697 1.06697C0.3838 1.75014 0 2.67671 0 3.64286L0 30.3571C0 31.3233 0.3838 32.2499 1.06697 32.933C1.75014 33.6162 2.67671 34 3.64286 34H20.6429C21.609 34 22.5356 33.6162 23.2187 32.933C23.9019 32.2499 24.2857 31.3233 24.2857 30.3571V25.6481C23.3003 24.8589 22.661 23.7169 22.5031 22.4643H13.9643C12.5151 22.4643 11.1252 21.8886 10.1005 20.8638C9.0757 19.8391 8.5 18.4492 8.5 17C8.5 15.5508 9.0757 14.1609 10.1005 13.1362C11.1252 12.1114 12.5151 11.5357 13.9643 11.5357H22.5031C22.661 10.2831 23.3003 9.14113 24.2857 8.35186V3.64286C24.2857 2.67671 23.9019 1.75014 23.2187 1.06697C22.5356 0.3838 21.609 0 20.6429 0L3.64286 0Z"
                    fill="#8FBFFA"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.5004 12.1431C25.5007 11.7831 25.6077 11.4312 25.8079 11.132C26.0081 10.8327 26.2924 10.5995 26.625 10.4618C26.9577 10.3241 27.3236 10.288 27.6768 10.3582C28.0299 10.4283 28.3543 10.6015 28.609 10.8559L33.4661 15.7131C33.8072 16.0546 33.9988 16.5175 33.9988 17.0002C33.9988 17.4829 33.8072 17.9458 33.4661 18.2874L28.609 23.1445C28.3543 23.3989 28.0299 23.5721 27.6768 23.6423C27.3236 23.7124 26.9577 23.6764 26.625 23.5386C26.2924 23.4009 26.0081 23.1677 25.8079 22.8684C25.6077 22.5692 25.5007 22.2174 25.5004 21.8574V19.4288H13.9647C13.3206 19.4288 12.7029 19.1729 12.2474 18.7175C11.792 18.262 11.5361 17.6443 11.5361 17.0002C11.5361 16.3561 11.792 15.7384 12.2474 15.283C12.7029 14.8275 13.3206 14.5716 13.9647 14.5716H25.5004V12.1431Z"
                    fill="#2859C5"
                  />
                </svg>
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
