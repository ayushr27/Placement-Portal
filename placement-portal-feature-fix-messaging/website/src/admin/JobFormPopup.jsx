import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

const JobFormPopup = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    company_name: "",
    website: "",
    linkedin_link: "",
    address: "",
    batch: [],
    work_location: "",
    job_designation: "",
    type_of_employment: "",
    eligibility_criteria: "",
    cgpa_eligibility: 6,
    applicable_branch: [],
    stipend: "",
    ctc: "",
    other_benefits: "",
    bond: "",
    job_description: "",
    about_company: "",
    selection_process: [""],
    form_link: "",
    application_deadline: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "batch") {
      const numericValue = Number(value);
      setFormData((prev) => ({
        ...prev,
        batch: checked
          ? [...prev.batch, numericValue]
          : prev.batch.filter((year) => year !== numericValue),
      }));
    } else if (type === "checkbox" && name === "applicable_branch") {
      setFormData((prev) => ({
        ...prev,
        applicable_branch: checked
          ? [...prev.applicable_branch, value]
          : prev.applicable_branch.filter((branch) => branch !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectionProcessChange = (index, value) => {
    const updatedProcess = [...formData.selection_process];
    updatedProcess[index] = value;
    setFormData((prev) => ({ ...prev, selection_process: updatedProcess }));
  };

  const addSelectionStep = () => {
    setFormData((prev) => ({
      ...prev,
      selection_process: [...prev.selection_process, ""],
    }));
  };

  const removeSelectionStep = (index) => {
    if (formData.selection_process.length > 1) {
      const updatedProcess = formData.selection_process.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({ ...prev, selection_process: updatedProcess }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up the data before submitting
    const payload = {
      ...formData,
      // Ensure arrays are properly formatted
      batch: formData.batch || [],
      applicable_branch: formData.applicable_branch || [],
      selection_process: formData.selection_process.filter(
        (step) => step.trim() !== ""
      ),
      // Ensure numeric values are properly formatted
      cgpa_eligibility: Number(formData.cgpa_eligibility) || 6,
    };
    
    console.log("Submitting job data:", payload);
    onSubmit(payload);
    onClose();
  };

  const batches = [2026, 2027, 2028, 2029];
  const employmentTypes = ["Full-time", "Part-time", "Internship", "Contract"];
  const branches = [
    "CSE",
    "ECE", 
    "AIDS",
    "MECH",
    "EEE",
    "Civil",
    "All Branches"
  ];

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-transparent bg-opacity-50"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white border-2 rounded-lg shadow-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-start mb-4">
            <div className="text-2xl font-bold text-gray-800">Post a Job</div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    name="linkedin_link"
                    value={formData.linkedin_link}
                    onChange={handleChange}
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Address
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Job Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Designation *
                  </label>
                  <input
                    name="job_designation"
                    value={formData.job_designation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type of Employment
                  </label>
                  <select
                    name="type_of_employment"
                    value={formData.type_of_employment}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    {employmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Location
                  </label>
                  <input
                    name="work_location"
                    value={formData.work_location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                 <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Applicable Branches
                   </label>
                   <div className="text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded-md border">
                     {formData.applicable_branch.length === 0 
                       ? "No branches selected" 
                       : formData.applicable_branch.join(", ")
                     }
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                     {branches.map((branch) => (
                       <label
                         key={branch}
                         className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                       >
                         <input
                           type="checkbox"
                           name="applicable_branch"
                           value={branch}
                           checked={formData.applicable_branch.includes(branch)}
                           onChange={handleChange}
                           className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                         />
                         <span className="text-sm font-medium text-gray-700">{branch}</span>
                       </label>
                     ))}
                   </div>
                 </div>
              </div>
            </div>

            {/* Compensation & Benefits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Compensation & Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stipend (for interns)
                  </label>
                  <input
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CTC (for full-time)
                  </label>
                  <input
                    name="ctc"
                    value={formData.ctc}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Benefits
                  </label>
                  <input
                    name="other_benefits"
                    value={formData.other_benefits}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bond Details
                  </label>
                  <input
                    name="bond"
                    value={formData.bond}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Eligibility & Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Eligibility & Selection Process
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eligibility Criteria
                </label>
                <textarea
                  name="eligibility_criteria"
                  value={formData.eligibility_criteria}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Eligibility Criteria"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CGPA Eligibility
                </label>
                <input
                  name="cgpa_eligibility"
                  value={formData.cgpa_eligibility}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="CGPA requirements"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selection Process Steps
                </label>
                {formData.selection_process.map((step, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={step}
                      onChange={(e) =>
                        handleSelectionProcessChange(index, e.target.value)
                      }
                      placeholder={`Step ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.selection_process.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSelectionStep(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSelectionStep}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add Step
                </button>
              </div>
            </div>

            {/* Batch Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Eligible Batches
              </h3>
              <div className="flex flex-wrap gap-4">
                {batches.map((year) => (
                  <label key={year} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="batch"
                      value={year}
                      checked={formData.batch.includes(year)}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span>{year}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Descriptions
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description *
                </label>
                <textarea
                  name="job_description"
                  value={formData.job_description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About Company
                </label>
                <textarea
                  name="about_company"
                  value={formData.about_company}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Application Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Application Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Form Link
                  </label>
                  <input
                    name="form_link"
                    value={formData.form_link}
                    onChange={handleChange}
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="datetime-local"
                    name="application_deadline"
                    value={formData.application_deadline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default JobFormPopup;
