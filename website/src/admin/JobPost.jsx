import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiFolder,
  FiEdit2,
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiExternalLink,
  FiTrash,
  FiSearch,
  FiDollarSign,
  FiBook,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import JobFormPopup from "./JobFormPopup";
import ModifyJobPopup from "./ModifyJobPopup";
import { API_URL } from "../../env-config";

// const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
//   if (!isOpen) return null;

//   return (
//     <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
//       <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//       <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
//         <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
//           <Dialog.Title className="text-xl font-bold text-gray-800">
//             {title}
//           </Dialog.Title>
//           <p className="mt-2 text-gray-600">{message}</p>
//           <div className="mt-4 flex justify-end space-x-2">
//             <button
//               onClick={onCancel}
//               className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
//             >
//               Cancel
//             </button>
//             {/* <button
//               onClick={onConfirm}
//               className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
//             >
//               Delete
//             </button> */}
//           </div>
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   );
// };

const JobPost = () => {
  const [jobs, setJobs] = useState([]);
  const [showPostPopup, setShowPostPopup] = useState(false);
  const [showModifyPopup, setShowModifyPopup] = useState(false);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [employmentFilter, setEmploymentFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [ctcFilter, setCtcFilter] = useState("all");
  const [deadlineFilter, setDeadlineFilter] = useState("all");

  const jobTypes = ["Full-time", "Part-time", "Internship", "Contract"];
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/jobs/get-jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setJobs(Array.isArray(res.data) ? res.data : []);
        setIsLoading(false);
        // console.log(res.data);
      } catch (err) {
        // console.error("Error fetching jobs:", err);
        toast.error("Failed to fetch jobs");
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);
  const handleUpdateMetrics = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${API_URL}/api/jobs/update-all-metrics`,
      {}, // empty body since -d '' in curl
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    toast.success("Job Metrics Updated Successfully!");
  } catch (e) {
    console.error(e);
    toast.error("Failed to Update Job Metrics");
  }
};

  const handlePostJob = async (jobData) => {
    try {
      console.log("Posting job data:", jobData);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const res = await axios.post(`${API_URL}/api/jobs/create`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      // Refresh the jobs list
      const fetchJobs = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/jobs/get-jobs`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setJobs(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.error("Error fetching jobs:", err);
        }
      };
      
      await fetchJobs();
      setShowPostPopup(false);
      toast.success("Job posted successfully!");
    } catch (err) {
      // console.error("Error posting job:", err);
      toast.error("Failed to post job");
    }
  };
const handleGetMetrics = async (jobId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${API_URL}/api/jobs/job_metrics`,
      {
        params: { jobid: jobId },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Metrics response:", res.data);

    toast.success("Metrics fetched successfully!");
  } catch (err) {
    console.error("Error fetching metrics:", err);
    toast.error("Failed to get metrics");
  }
};



  const handleModifyJob = async (updatedJob) => {
    try {
      const token = localStorage.getItem("token");

      // Build the request body with all fields
      const requestBody = {
        company_name: updatedJob.company_name || "",
        website: updatedJob.website || "",
        linkedin_link: updatedJob.linkedin_link || "",
        address: updatedJob.address || "",
        batch: updatedJob.batch || [],
        work_location: updatedJob.work_location || "",
        job_designation: updatedJob.job_designation || "",
        type_of_employment: updatedJob.type_of_employment || "",
        eligibility_criteria: updatedJob.eligibility_criteria || "",
        cgpa_eligibility: updatedJob.cgpa_eligibility || 6,
        applicable_branch: updatedJob.applicable_branch || [],
        stipend: updatedJob.stipend || "",
        ctc: updatedJob.ctc || "",
        other_benefits: updatedJob.other_benefits || "",
        bond: updatedJob.bond || "",
        job_description: updatedJob.job_description || "",
        about_company: updatedJob.about_company || "",
        selection_process: updatedJob.selection_process || [],
        form_link: updatedJob.form_link || "",
        application_deadline: updatedJob.application_deadline || "",
      };

      // Send PUT request
      // console.log(updatedJob._id);
      const res = await axios.put(
        `${API_URL}/api/jobs/update/${updatedJob._id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setJobs((jobs) =>
        jobs.map((job) => (job._id === updatedJob._id ? res.data : job))
      );
      setShowModifyPopup(false);
      toast.success("Job updated successfully!");
    } catch (err) {
      // console.error(
      //   "Error updating job:",
      //   err.response?.data || err.message
      // );
      toast.error("Failed to update job");
    }
  };


  const handleSyncJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/jobs/sync-expired`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Jobs synced successfully!");
    } catch (err) {

      toast.error("Failed to sync jobs");
    }
  };

  const filteredJobs = jobs.filter((job) => {

    const matchesSearch =
      !searchTerm ||
      job.job_designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchTerm.toLowerCase());

  
    const matchesEmployment =
      employmentFilter === "all" ||
      job.type_of_employment?.toLowerCase() === employmentFilter.toLowerCase();


    const matchesBatch =
      batchFilter === "all" || job.batch?.includes(Number(batchFilter));


    const matchesLocation =
      locationFilter === "all" ||
      job.work_location?.toLowerCase() === locationFilter.toLowerCase();

  
    let matchesCtc = true;
    if (ctcFilter !== "all" && job.ctc) {
      const ctcValue = parseFloat(job.ctc); 
      if (!isNaN(ctcValue)) {
        if (ctcFilter === "lt5" && ctcValue >= 5) matchesCtc = false;
        if (ctcFilter === "5to10" && (ctcValue < 5 || ctcValue > 10))
          matchesCtc = false;
        if (ctcFilter === "gt10" && ctcValue <= 10) matchesCtc = false;
      }
    }

  
    let matchesDeadline = true;
    if (deadlineFilter !== "all" && job.application_deadline) {
      const now = new Date();
      const deadline = new Date(job.application_deadline);

        if (deadlineFilter === "active" && deadline < now)
          matchesDeadline = false;
        if (
          deadlineFilter === "soon" &&
          (deadline < now ||
            deadline > new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000))
        ) {
          matchesDeadline = false;
        }
        if (deadlineFilter === "expired" && deadline >= now)
          matchesDeadline = false;
      }

      // --- Final Decision ---
      return (
        matchesSearch &&
        matchesEmployment &&
        matchesBatch &&
        matchesLocation &&
        matchesCtc &&
        matchesDeadline
      );
    })
    .sort((a, b) => {
      // Sort by newest jobs first (by creation date or application deadline)
      const dateA = a.created_at ? new Date(a.created_at) : (a.application_deadline ? new Date(a.application_deadline) : new Date(0));
      const dateB = b.created_at ? new Date(b.created_at) : (b.application_deadline ? new Date(b.application_deadline) : new Date(0));
      
      return dateB - dateA; // Newest first
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-[#F5F7FC] min-h-screen p-2 sm:p-4 md:p-8 font-[Figtree]">
      <div className="max-w-6xl mx-auto">
        {/* Header with Title and Create Button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Job Postings</h1>
          <div className="flex sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleUpdateMetrics}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#10793F] text-white rounded-xl shadow-lg hover:bg-white hover:text-black transition-colors text-sm sm:text-base"
            >
            ↻Metrics
            </button>
            <button
              onClick={handleSyncJobs}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#57C62B] text-white rounded-xl shadow-lg hover:bg-[#4da72a] transition-colors text-sm sm:text-base"
            >
              Sync
            </button>
            <button
              onClick={() => setShowPostPopup(true)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-black text-white rounded-xl shadow-lg hover:bg-gray-900 transition-colors text-sm sm:text-base"
            >
              <span className="text-lg sm:text-xl">+</span> Post 
            </button>
          </div>
        </div>
        <hr className="border-gray-300 mb-4 sm:mb-6" />

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Search */}
          <div className="relative flex-1 min-w-full sm:min-w-[250px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by designation or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm sm:text-base rounded-xl border-2 border-gray-300 
                 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
<div className="flex flex-wrap gap-3 sm:gap-4">
          {/* Batch */}
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-xl border-2 border-gray-300 
               focus:outline-none focus:border-blue-500 transition-colors w-fit sm:w-auto"
          >
            <option value="all">All Batches</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>

          {/* Work Location */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-xl border-2 border-gray-300 
               focus:outline-none focus:border-blue-500 transition-colors w-fit sm:w-auto"
          >
            <option value="all">All Locations</option>
            <option value="WFH">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">On-site</option>
          </select>

          {/* Type of Employment */}
          <select
            value={employmentFilter}
            onChange={(e) => setEmploymentFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-xl border-2 border-gray-300 
               focus:outline-none focus:border-blue-500 transition-colors w-fit sm:w-auto"
          >
            <option value="all">All Types</option>
            <option value="internship">Internship</option>
            <option value="ppo">PPO</option>
            <option value="fulltime">Full-time</option>
          </select>

          {/* CTC */}
          <select
            value={ctcFilter}
            onChange={(e) => setCtcFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-xl border-2 border-gray-300 
               focus:outline-none focus:border-blue-500 transition-colors w-fit sm:w-auto"
          >
            <option value="all">All CTC</option>
            <option value="lt5">Less than 5 LPA</option>
            <option value="5to10">5–10 LPA</option>
            <option value="gt10">10+ LPA</option>
          </select>

          {/* Deadline */}
          <select
            value={deadlineFilter}
            onChange={(e) => setDeadlineFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-xl border-2 border-gray-300 
               focus:outline-none focus:border-blue-500 transition-colors w-fit sm:w-auto"
          >
            <option value="all">All Deadlines</option>
            <option value="active">Active</option>
            <option value="soon">Closing Soon</option>
            <option value="expired">Expired</option>
          </select>
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-6 mt-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700">
                No jobs found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-200 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    {/* Left Section - Company and Job Details */}
                    <div className="flex-1 space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                            {job.job_designation}
                          </h2>
                          <p className="text-base sm:text-lg font-semibold text-gray-700">
                            {job.company_name}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit sm:w-auto">
                          {job.type_of_employment}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                          <FiMapPin className="text-gray-400 flex-shrink-0" />
                          <span>{job.work_location || "Not specified"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                          <FiUser className="text-gray-400 flex-shrink-0" />
                          <span className="break-words">
                            {Array.isArray(job.applicable_branch) 
                              ? job.applicable_branch.length > 0 
                                ? job.applicable_branch.join(", ")
                                : "All branches"
                              : job.applicable_branch || "All branches"
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                          <FiDollarSign className="text-gray-400 flex-shrink-0" />
                          <span className="break-words">
                            {job.ctc
                              ? `CTC: ${job.ctc}`
                              : job.stipend
                              ? `Stipend: ${job.stipend}`
                              : "Salary not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                          <FiCalendar className="text-gray-400 flex-shrink-0" />
                          <span>
                            Batch: {job.batch?.join(", ") || "Not specified"}
                          </span>
                        </div>
                      </div>
                            <div className="flex flex-wrap">
                      {job.eligibility_criteria && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-700 mb-2">
                            Eligibility Criteria
                          </h4>
                          <p className="text-sm text-gray-600">
                            {job.eligibility_criteria}
                          </p>
                        </div>
                      )}
                      {job.cgpa_eligibility && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-700 mb-2">
                            CGPA Eligibility
                          </h4>
                          <p className="text-sm text-gray-600">
                            {job.cgpa_eligibility}
                          </p>
                        </div>
                      )}</div>
                    </div>

                    {/* Right Section - Actions and Additional Info */}
                    <div className="lg:w-80 space-y-3 sm:space-y-4">
                      {/* Application Deadline */}
                      {job.application_deadline && (
                        <div className="bg-red-50 p-2 sm:p-3 rounded-lg">
                          <div className="flex items-center gap-2 text-sm sm:text-base text-red-700">
                            <FiClock className="text-red-500 flex-shrink-0" />
                            <span className="font-semibold">Apply before:</span>
                          </div>
                          <p className="text-xs sm:text-sm text-red-600 mt-1">
                            {formatDateTime(job.application_deadline)}
                          </p>
                        </div>
                      )}

                      {/* Selection Process */}
                      {job.selection_process &&
                        job.selection_process.length > 0 && (
                          <div className="bg-green-50 p-2 sm:p-3 rounded-lg">
                            <h4 className="font-semibold text-sm sm:text-base text-green-700 mb-2">
                              Selection Process
                            </h4>
                            <ol className="list-decimal list-inside text-xs sm:text-sm text-green-600 space-y-1">
                              {job.selection_process.map((step, index) => (
                                <li key={index} className="break-words">{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowModifyPopup(true);
                          }}
                          className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-colors"
                        >
                          <FiEdit2 size={14} className="sm:w-4 sm:h-4" />
                          Edit
                        </button>
                        <div className="flex justify-around items-center gap-2">
                          
                          <a
                            href={job.responses_sheet_link}
                            target="_blank"
                            className="flex items-center justify-center gap-1 sm:gap-2 bg-[#10793F] hover:bg-white hover:text-black text-white px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors flex-1"
                          >
                            <img
                              src="/excel-logo.png"
                              width={16}
                              height={16}
                              className="sm:w-6 sm:h-6"
                              alt=""
                            />
                            <span className="hidden sm:inline">Response</span>
                            <span className="sm:hidden">Resp</span>
                          </a>
                          <a
                            href={job.master_sheet_link}
                            target="_blank"
                            className="flex items-center justify-center gap-1 sm:gap-2 bg-[#10793F] hover:bg-white hover:text-black text-white px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors flex-1"
                          >
                            <img
                              src="/excel-logo.png"
                              width={16}
                              height={16}
                              className="sm:w-6 sm:h-6"
                              alt=""
                            />
                            <span className="hidden sm:inline">Master</span>
                            <span className="sm:hidden">Mstr</span>
                          </a>
                        </div>
                        {/* <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowDeleteModal(true);
                          }}
                          className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                          <FiTrash size={16} className="text-red-500" />
                          Delete
                        </button> */}
                        {/* {job.form_link && (
                          <a
                            href={job.form_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            <FiExternalLink size={16} />
                            Apply Now
                          </a>
                        )} */}
                      </div>

                      {/* Created Info */}
                      <div className="text-xs flex flex-wrap justify-evenly items-center  text-gray-500">
                        <div className="">

                        <p>Created: {formatDate(job.created_at)}</p>
                        {job.updated_at && (
                          <p>Updated: {formatDate(job.updated_at)}</p>
                        )}
                        </div>
                        <div className="flex flex-wrap justify-between items-center">
                          <button
                            onClick={() => handleGetMetrics(job._id)}

                            
                            className="flex items-center mx-[2px] w-fit justify-center gap-2 bg-[#57C62B]  hover:bg-[#4da72a]  text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            
                            Get Metrics
                          </button>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popups */}
      {showPostPopup && (
        <JobFormPopup
          onClose={() => setShowPostPopup(false)}
          onSubmit={handlePostJob}
        />
      )}
      {showModifyPopup && selectedJob && (
        <ModifyJobPopup
          job={selectedJob}
          onClose={() => setShowModifyPopup(false)}
          onSubmit={handleModifyJob}
        />
      )}
      {/* <ConfirmationModal
        isOpen={showDeleteModal}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the job posting for "${selectedJob?.job_designation}" at "${selectedJob?.company_name}"? This action cannot be undone.`}
        onConfirm={() => handleDeleteJob(selectedJob?._id)}
        onCancel={() => setShowDeleteModal(false)}
      /> */}
      <ToastContainer />
    </div>
  );
};

export default JobPost;