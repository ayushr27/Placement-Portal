import React, { useState, useEffect } from "react";
import { API_URL } from "../../env-config";
const StudentProfile = () => {
  const [student, setStudent] = useState(null);

  const fetchProfile = async () => {
    try {
      const profileRes = await fetch(`${API_URL}/profile/student/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!profileRes.ok) {
        throw new Error(`Error: ${profileRes.status} ${profileRes.statusText}`);
      }

      const data = await profileRes.json();
      console.log("Fetched profile:", data);

      setStudent({
        name: data.name || "",
        fatherName: "",
        rollNumber: data.roll_number || "",
        dob: "",
        email: data.email || "",
        mobileNumber: data.phone_no || "",
        gender: data.gender || "",
        address: "",
        linkedin: "",
        github: "",
        portfolio: "",
        degreeDetails: {
          degree: data.course || "",
          major: "",
          branch: data.branch || "",
          year: `${data.year || ""} Year`,
          expectedPassout: "",
          gpa: "",
          cgpa: "",
        },
        academicRecords: [],
        certifications: [],
        internships: [],
        achievements: [],
        skills: [],
        projects: [],
      });
    } catch (err) {
      console.error("Failed to fetch the profile:", err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!student) {
    return <p className="p-6">Loading profile...</p>;
  }

  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">
        Student Dashboard
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 flex flex-col items-center md:flex-row md:items-start">
        <div className="bg-blue-500 text-white rounded-full w-32 h-32 md:w-48 md:h-48 flex items-center justify-center text-7xl font-bold mr-0 md:mr-6 mb-4 md:mb-0">
          {getInitials(student.name)}
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-blue-700">{student.name}</h2>
          <p className="text-lg">
            <strong>Father's Name:</strong> {student.fatherName}
          </p>
          <p className="text-lg">
            <strong>Roll Number:</strong> {student.rollNumber}
          </p>
          <p className="text-lg">
            <strong>Date of Birth:</strong> {student.dob}
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">
          Contact Information
        </h2>
        <p>
          <strong>Email:</strong> {student.email}
        </p>
        <p>
          <strong>Mobile Number:</strong> {student.mobileNumber}
        </p>
        <p>
          <strong>Gender:</strong> {student.gender}
        </p>
        <p>
          <strong>Address:</strong> {student.address}
        </p>
      </div>

      {/* Degree Details */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">
          Degree Details
        </h2>
        <p>
          <strong>Degree:</strong> {student.degreeDetails.degree}
        </p>
        <p>
          <strong>Branch:</strong> {student.degreeDetails.branch}
        </p>
        <p>
          <strong>Year:</strong> {student.degreeDetails.year}
        </p>
      </div>
    </div>
  );
};

export default StudentProfile;
