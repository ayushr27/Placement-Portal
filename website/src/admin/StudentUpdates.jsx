import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../env-config";


// --- Inline SVG Icon Components (Replaced react-icons) ---

const UserIcon = ({ className = "text-indigo-600", size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const SaveIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

// --- Main Component ---

const StudentUpdates = ({ student, onClose, onStudentFound }) => {
  // Mocking SERVER_URI and API_URL based on the original structure
  const SERVER_URI = API_URL;

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    gender: "other",
    email: "",
    date_of_birth: "",
    phone_no: "",
    username: "",
    roll_number: "",
    branch: "",
    course: "",
    batch: "",
    ssc_cgpa: 0,
    hsc_cgpa: 0,
    btech_cgpa: 0,
    mtech_cgpa: 0,
    backlogs: 0,
    current_address: "",
    permanent_address: "",
    linkedin_link: "",
    github_link: "",
    resume_link: "",
    // START NEW FIELDS
    aadhar_card_link: "",
    pan_card_link: "",
    // END NEW FIELDS
    role: "student",
    career_path: "",
    
  });
  const [isLoading, setIsLoading] = useState(false);

  const branches = ["cse", "ece", "aids", "mech"];
  const courses = ["BTech", "DualDegree", "MTech", "PhD"];
  const genders = ["male", "female", "other"];
  const careerPaths = ["Higher Studies", "Job", "Entrepreneurship"];

  // ✅ Pre-fill data when popup opens
  useEffect(() => {
    if (student) {
      setFormData({
        _id: student._id || "",
        name: student.name || "",
        gender: student.gender || "other",
        email: student.email || "",
        date_of_birth: student.date_of_birth || "",
        phone_no: student.phone_no || "",
        username: student.username || "",
        roll_number: student.roll_number || "",
        branch: student.branch || "",
        course: student.course || "",
        batch: student.batch || "",
        ssc_cgpa: student.ssc_cgpa || 0,
        hsc_cgpa: student.hsc_cgpa || 0,
        btech_cgpa: student.btech_cgpa || 0,
        mtech_cgpa: student.mtech_cgpa || 0,
        backlogs: student.backlogs || 0,
        current_address: student.current_address || "",
        permanent_address: student.permanent_address || "",
        linkedin_link: student.linkedin_link || "",
        github_link: student.github_link || "",
        resume_link: student.resume_link || "",
        // START PRE-FILL NEW FIELDS
        aadhar_card_link: student.aadhar_card_link || "",
        pan_card_link: student.pan_card_link || "",
        // END PRE-FILL NEW FIELDS
        role: student.role || "student",
        career_path: student.career_path || "",
        
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCareerPathChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      let newPath = prev.career_path ? prev.career_path.split(",") : [];
      if (checked) newPath.push(value);
      else newPath = newPath.filter((p) => p !== value);
      // Ensure the value remains a comma-separated string
      return { ...prev, career_path: newPath.join(",") };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData._id) {
        // Construct the payload to match the schema, ensuring all fields are sent
        const payload = {
            ...formData,
            // The API schema shows date_of_birth as Z-formatted date string,
            // but for a PUT request with a date input, the collected date string is often sufficient.
            date_of_birth: formData.date_of_birth,
        };

        // WARNING: axios is an external dependency. This code relies on the runtime environment having it.
        await axios.put(
          `${SERVER_URI}/profile/admin/student_update/${formData.roll_number}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        // WARNING: toast is an external dependency. This code relies on the runtime environment having it.
        toast.success("Student updated successfully!");
      }
      onStudentFound(); // Call parent function to refresh data
      onClose(); // Close the modal/form
    } catch (error) {
      console.error("Error:", error);
      // WARNING: toast is an external dependency.
      // toast.error(
      //   error.response?.data?.message ||
      //   "Failed to save student profile. Please try again."
      // );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 p-6 font-inter">
      <div className="max-w-5xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-2xl space-y-8 border border-gray-100"
        >
          {/* Title */}
          <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-3 border-b pb-4 mb-4">
            <UserIcon />
            Edit Student Profile
          </h2>

          {/* Basic Information */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={genders}
              />
              <Input
                label="Date of Birth"
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
              <Input
                label="Phone Number"
                type="tel"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Academic Information */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
              Academic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Roll Number", name: "roll_number", type: "text" },
                {
                  label: "Branch",
                  name: "branch",
                  type: "select",
                  options: branches,
                },
                {
                  label: "Course",
                  name: "course",
                  type: "select",
                  options: courses,
                },
                { label: "Batch Year", name: "batch", type: "number" },
                { label: "SSC CGPA", name: "ssc_cgpa", type: "number", step: "0.1" },
                { label: "HSC CGPA", name: "hsc_cgpa", type: "number", step: "0.1" },
                {
                  label: "B.Tech CGPA",
                  name: "btech_cgpa",
                  type: "number",
                  step: "0.1",
                },
                {
                  label: "M.Tech CGPA",
                  name: "mtech_cgpa",
                  type: "number",
                  step: "0.1",
                },
                { label: "Backlogs", name: "backlogs", type: "number" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <Select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      options={field.options}
                      placeholder={`Select ${field.label}`}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      step={field.step}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Address and Links */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
              Address & Important Links
            </h3>
            <div className="space-y-4">
              <Textarea
                name="current_address"
                value={formData.current_address}
                onChange={handleChange}
                placeholder="Current Address"
              />
              <Textarea
                name="permanent_address"
                value={formData.permanent_address}
                onChange={handleChange}
                placeholder="Permanent Address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                type="url"
                name="linkedin_link"
                value={formData.linkedin_link}
                onChange={handleChange}
                placeholder="LinkedIn Profile Link (URL)"
              />
              <Input
                type="url"
                name="github_link"
                value={formData.github_link}
                onChange={handleChange}
                placeholder="GitHub Profile Link (URL)"
              />
              <Input
                type="url"
                name="resume_link"
                value={formData.resume_link}
                onChange={handleChange}
                placeholder="Resume Link (URL)"
              />
              {/* START NEW INPUT FIELDS */}
              <Input
                type="url"
                name="aadhar_card_link"
                value={formData.aadhar_card_link}
                onChange={handleChange}
                placeholder="Aadhar Card Link (URL)"
              />
              <Input
                type="url"
                name="pan_card_link"
                value={formData.pan_card_link}
                onChange={handleChange}
                placeholder="PAN Card Link (URL)"
              />
              {/* END NEW INPUT FIELDS */}
            </div>
          </section>

          {/* Career Path */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
              Career Path Preference
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {careerPaths.map((path) => (
                <label key={path} className="flex items-center gap-2 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    value={path}
                    checked={formData.career_path?.split(",").includes(path)}
                    onChange={handleCareerPathChange}
                    className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                  />
                  <span className="text-sm font-medium">{path}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition duration-150 shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition duration-150 shadow-lg flex items-center gap-2 transform hover:scale-[1.02]"
            >
              <SaveIcon size={18} />
              {isLoading ? "Saving..." : "Save Student Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper components for clean JSX structure and consistent styling
const Input = ({ label, name, value, onChange, type = "text", placeholder, required = false, step }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      step={step}
      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150"
    />
  </div>
);

const Textarea = ({ name, value, onChange, placeholder }) => (
  <textarea
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={2}
    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150"
  />
);

const Select = ({ label, name, value, onChange, options, placeholder }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150 bg-white"
    >
      <option value="" disabled>
        {placeholder || `Select ${label}`}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt.toLowerCase()}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default StudentUpdates;
