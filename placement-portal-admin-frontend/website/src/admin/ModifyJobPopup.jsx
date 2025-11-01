import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import {
  FiX,
  FiBriefcase,
  FiDollarSign,
  FiMapPin,
  FiGlobe,
  FiClock,
  FiBook,
  FiAward,
} from "react-icons/fi";

// Define constants outside the component
const jobTypes = ["Full-time", "Part-time", "Internship", "Contract"];
const industries = [
  "IT",
  "Manufacturing",
  "Finance",
  "Healthcare",
  "Education",
  "Design",
];
const branches = ["CSE", "ECE", "AIDS", "MECH", "EEE", "All Branches"];

const ModifyJobPopup = ({ job, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    website: "",
    type: "",
    location: "",
    industry: "",
    salary: "",
    branch: "",
    description: "",
    cgpa: "",
    gender: [],
    backlogsAllowed: "No",
    deadline: "",
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        company: job.company || "",
        website: job.website || "",
        type: job.type || "",
        location: job.location || "",
        industry: job.industry || "",
        salary: job.salary || "",
        branch: job.branch || "",
        description: job.description || "",
        cgpa: job.cgpa || "",
        gender: job.gender || [],
        backlogsAllowed: job.backlogsAllowed || "No",
        deadline: job.deadline || "",
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        gender: checked
          ? [...prev.gender, value]
          : prev.gender.filter((g) => g !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-xl font-semibold">
              Edit Job Posting
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Job Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiBriefcase className="text-indigo-600" />
                Job Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title*
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name*
                  </label>
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGlobe className="text-gray-400" />
                    </div>
                    <input
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      type="url"
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Job Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Type</option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location & Compensation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiMapPin className="text-indigo-600" />
                Location & Compensation
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Salary/Stipend
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <input
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Eligible Branch
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Branches</option>
                    {branches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiBook className="text-indigo-600" />
                Job Description
              </h3>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter detailed job description..."
              />
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiAward className="text-indigo-600" />
                Requirements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum CGPA
                  </label>
                  <input
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Date to Apply
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiClock className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Gender Preference
                </label>
                <div className="flex flex-wrap gap-4">
                  {["Male", "Female", "Other"].map((gender) => (
                    <label key={gender} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="gender"
                        value={gender}
                        checked={formData.gender.includes(gender)}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span>{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Backlogs Allowed
                </label>
                <div className="flex flex-wrap gap-4">
                  {["No", "Yes", "Conditional"].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="backlogsAllowed"
                        value={option}
                        checked={formData.backlogsAllowed === option}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default ModifyJobPopup;
