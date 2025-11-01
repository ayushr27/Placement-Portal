import React, { useState } from 'react';

const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    personalEmail: '',
    collegeEmail: '',
    branch: '',
    tenthMarks: '',
    twelfthMarks: '',
    currentCgpa: '',
    mobileNumber: '',
    btechOrMtech: '',
    sgpa: '',
    tenthPassYear: '',
    twelfthPassYear: '',
    backlogsCurrent: '',
    resume: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value 
    });
  };

  const handleSubmit = (e) => {

  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Section */}
      <div
        className="lg:w-[40%] w-full text-white flex flex-col p-6 lg:p-8 bg-cover bg-center bg-blue-800"
        style={{ backgroundImage: "url('/bg.svg')" }}
      >
        <h5 className="mb-4 lg:mb-7 text-xl lg:text-2xl">IIITDM Kurnool Placements</h5>
        <p className="text-2xl lg:text-4xl mb-4 font-semibold text-black text-justify">
          One stop portal for students & companies for placements.
        </p>
        <div className="flex justify-center mt-6 lg:mt-12 mb-6">
          <img
            src="/logo.webp"
            alt="IIITDM Kurnool Logo"
            className="w-40 h-40 lg:w-56 lg:h-56"
          />
        </div>
        <p className="text-sm font-semibold mb-2">Instructions</p>
        <p className="text-sm font-semibold">Please fill in all the details correctly:</p>
      </div>

      {/* Right Section */}
      <div className="lg:w-[60%] w-full bg-white flex flex-col justify-center items-center p-6 lg:p-8">
        <h2 className="text-xl lg:text-2xl font-bold text-blue-700 mb-4 lg:mb-6">Student Registration Form</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {[
            { label: 'Name', type: 'text', name: 'name', placeholder: 'Enter full name', required: true },
            { label: 'Personal Email', type: 'email', name: 'personalEmail', placeholder: 'Enter personal email', required: true },
            { label: 'College Email', type: 'email', name: 'collegeEmail', placeholder: 'Enter college email', required: true },
            { label: 'Branch', type: 'text', name: 'branch', placeholder: 'Enter your branch', required: true },
            { label: 'Tenth Marks', type: 'number', name: 'tenthMarks', placeholder: 'Marks in 10th', required: true },
            { label: 'Twelfth Marks', type: 'number', name: 'twelfthMarks', placeholder: 'Marks in 12th', required: true },
            { label: 'Current CGPA', type: 'number', step: '0.01', name: 'currentCgpa', placeholder: 'Enter current CGPA', required: true },
            { label: 'Mobile Number', type: 'text', name: 'mobileNumber', placeholder: 'Enter mobile number', required: true },
            { label: 'B.Tech or M.Tech', type: 'select', name: 'btechOrMtech', required: true, options: ['Select', 'BTech', 'MTech'] },
            { label: 'SGPA', type: 'number', step: '0.01', name: 'sgpa', placeholder: 'SGPA' },
            { label: 'Tenth Pass Year', type: 'number', name: 'tenthPassYear', placeholder: 'Year of passing 10th', required: true },
            { label: 'Twelfth Pass Year', type: 'number', name: 'twelfthPassYear', placeholder: 'Year of passing 12th', required: true },
            { label: 'Backlogs Current', type: 'number', name: 'backlogsCurrent', placeholder: 'Number of current backlogs' },
            { label: 'Resume', type: 'file', name: 'resume', required: true, accept: '.pdf,.doc,.docx' },
          ].map(({ label, ...inputProps }, index) => (
            <div className="mb-4 flex flex-col text-left" key={index}>
              <label className="block text-blue-600 mb-1 text-sm">{label}:</label>
              {inputProps.type === 'select' ? (
                <select
                  className="w-full p-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-400"
                  {...inputProps}
                  onChange={handleChange}
                >
                  {inputProps.options.map((option, idx) => (
                    <option key={idx} value={option === 'Select' ? '' : option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...inputProps}
                  className="w-full p-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-400"
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700 transition mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;