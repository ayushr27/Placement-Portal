import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PlacementLogin = () => {
  // State to track which form is active
  const [activeTab, setActiveTab] = useState('Student');

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}

      <div
        className="w-[40%] text-white flex flex-col p-8 bg-cover bg-center bg-no-repeat bg-blue-800"
        style={{ backgroundImage: "url('/bg.svg')" }}
      >
        <h5 className="mb-6">IIITDM Kurnool Placements</h5>
        <p className="text-4xl mb-4 text-black font-semibold">
          One stop portal for students & companies for placements.
        </p>
        <img
          src="/logo.webp"
          alt="IIITDM Kurnool Logo"
          className="mb-4 mt-16 ml-[130px] w-[250px] h-[250px]"
        />
        <p className="text-sm font-semibold mt-[120px]">Instructions</p>
        <p className="text-sm font-semibold">Login using your provided credentials.</p>
      </div>


      {/* Right Section */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-8">
        <h2 className="text-xl font-bold mb-8 text-blue-500">Sign-in to IIITDM Kurnool Placement Portal</h2>

        {/* Tabs for Student, Recruiter,  Admin */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 ${activeTab === 'Student' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Student')}
          >
            Student
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'Recruiter' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Recruiter')}
          >
            Recruiter
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'Admin' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Admin')}
          >
            Admin
          </button>
        </div>

        {/* Conditionally Render Forms Based on Active Tab */}
        {activeTab === 'Student' && (
          <form className="w-full max-w-md space-y-4">
            <div>
              <input
                type="text"
                placeholder="Roll"
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 p-2 rounded"
              />
              <span className="absolute right-2 top-2 cursor-pointer">👁️</span>
            </div>
            <div className="flex items-center justify-between">
              <a href="#" className="text-blue-500">Forgot password?</a>
            </div>
            {/* <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">I'm not a robot</label>
            </div> */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"

              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {activeTab === 'Recruiter' && (
          <form className="w-full max-w-md space-y-4">
            <div>
              <input
                type="text"
                placeholder="Recruiter Email"
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 p-2 rounded"
              />
              <span className="absolute right-2 top-2 cursor-pointer">👁️</span>
            </div>
            <div className="flex items-center justify-between">
              <a href="#" className="text-blue-500">Forgot password?</a>
            </div>
            {/* <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">I'm not a robot</label>
            </div> */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {activeTab === 'Admin' && (
          <form className="w-full max-w-md space-y-4">
            <div>
              <input
                type="text"
                placeholder="Admin ID"
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 p-2 rounded"
              />
              <span className="absolute right-2 top-2 cursor-pointer">👁️</span>
            </div>
            <div className="flex items-center justify-between">
              <a href="#" className="text-blue-500">Forgot password?</a>
            </div>
            {/* <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">I'm not a robot</label>
            </div> */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        <p className="mt-4">
          Don't have an account? <Link to="/register" className="text-blue-500">Register now</Link>
        </p>
      </div>
        <Link to='/'>
        <button
                type="submit"
                className="w-[100px] h-[50px] p-2 mt-5 mr-5 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 font-semibold"
              >
        Home
      </button>
        </Link>
      
    </div>
  );
};

export default PlacementLogin;
