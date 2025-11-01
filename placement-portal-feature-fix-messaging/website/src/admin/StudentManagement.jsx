import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import StudentUpdates from "./StudentUpdates";
import Sidebar from "../components/SideNav";
import { FiEdit } from "react-icons/fi";
import LogoNav from "../components/LogoNav";
import { API_URL } from "../../env-config";
const StudentManagement = () => {
  // const SERVER_URI = "https://placement-portal-registry-latest.onrender.com";
  const SERVER_URI = API_URL;
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchRollNumber, setSearchRollNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchStudent = async () => {
    if (!searchRollNumber) {
      toast.error("Please enter a roll number to search.");
      return;
    }

    setIsSearching(true);

    try {
      const response = await axios.get(
        `${SERVER_URI}/profile/admin/student/${searchRollNumber}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          validateStatus: (status) => true, // ✅ Accept all status codes
        }
      );

      if (response.status === 404) {
        toast.info("Student not found.");
        setSelectedStudent(null);
      } else if (response.status >= 200 && response.status < 300) {
        setSelectedStudent(response.data);
        // console.log(selectedStudent);
        toast.success("Student found!");
      } else {
        toast.error("Unexpected error occurred.");
        setSelectedStudent(null);
      }
    } catch (error) {
      // ✅ Only catches true network errors (e.g. no internet, CORS fail)
      toast.error("Network error while fetching student profile.");
      setSelectedStudent(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClosePopup = () => {
    setShowStudentPopup(false);
    setSelectedStudent(null);
    setSearchRollNumber("");
  };

  const handleEditClick = () => {
    setShowStudentPopup(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <LogoNav/>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Search Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Search Student</h2>
              <form className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter Roll Number"
                  value={searchRollNumber}
                  onChange={(e) => setSearchRollNumber(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSearchStudent}
                  disabled={isSearching}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </form>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <p className="text-sm text-blue-800">
                Note: Enter the student's roll number to search and update their
                profile. If a student is found, their information will appear
                below with an "Edit" button. If not, you can create a new
                profile by searching for their roll number and then clicking on
                the edit button.
              </p>
            </div>

            {/* Student Info Display */}
            {selectedStudent && (
              <div className="bg-white p-6 rounded-lg shadow-md mt-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {selectedStudent.name || "New Student"}
                  </h3>
                  <p className="text-gray-600">
                    Roll Number: {selectedStudent.roll_number}
                  </p>
                  {selectedStudent.branch && (
                    <p className="text-gray-600">
                      Branch: {selectedStudent.branch}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <FiEdit size={18} /> {selectedStudent._id ? "Edit" : "Create"}
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Student Updates Popup */}
        {showStudentPopup && selectedStudent && (
          <div className="fixed inset-0 bg-[rgb(0,0,0,0.1)] bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <StudentUpdates
                student={selectedStudent}
                onClose={handleClosePopup}
                onStudentFound={handleSearchStudent}
              />
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default StudentManagement;
