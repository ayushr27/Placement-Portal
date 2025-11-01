import React, { useState, useEffect } from "react";
import {
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../env-config";
import { FiSearch } from "react-icons/fi";

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border-2 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const JobDetails = ({ job }) => {
  if (!job) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const userData = JSON.parse(localStorage.getItem("user"));
  const cgpa = userData?.btech_cgpa || 0;
  const eligible = cgpa >= (job.cgpa_eligibility || 0);

  return (
    <div className="space-y-4">
      {/* Title & Company */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {job.job_designation}
        </h2>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          {job.company_name}
        </h3>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <FiMapPin className="text-gray-400" />
          <span>
            <strong>Location:</strong> {job.work_location || "Not specified"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FiBriefcase className="text-gray-400" />
          <span>
            <strong>Type:</strong> {job.type_of_employment || "Not specified"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FiUser className="text-gray-400" />
          <span>
            <strong>Branch:</strong> {job.applicable_branch || "All branches"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FiDollarSign className="text-gray-400" />
          <span>
            <strong>Compensation:</strong>{" "}
            {job.ctc
              ? `CTC: ${job.ctc}`
              : job.stipend
              ? `Stipend: ${job.stipend}`
              : "Not specified"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-400" />
          <span>
            <strong>Batch:</strong> {job.batch?.join(", ") || "Not specified"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FiClock className="text-gray-400" />
          <span>
            <strong>Deadline:</strong>{" "}
            {job.application_deadline
              ? formatDate(job.application_deadline)
              : "Not specified"}
          </span>
        </div>
      </div>

      {/* Optional Sections */}
      {job.eligibility_criteria && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">
            Eligibility Criteria
          </h4>
          <p className="text-gray-700">{job.eligibility_criteria}</p>
        </div>
      )}

      {job.job_description && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Job Description</h4>
          <p className="text-gray-700">{job.job_description}</p>
        </div>
      )}

      {job.about_company && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">About Company</h4>
          <p className="text-gray-700">{job.about_company}</p>
        </div>
      )}

      {job.selection_process && job.selection_process.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">
            Selection Process
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            {job.selection_process.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {job.other_benefits && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Other Benefits</h4>
          <p className="text-gray-700">{job.other_benefits}</p>
        </div>
      )}

      {job.bond && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Bond Details</h4>
          <p className="text-gray-700">{job.bond}</p>
        </div>
      )}

      {/* ✅ Apply Button Logic */}
      {job.form_link && (
        <div className="text-center mt-6">
          {eligible ? (
            <a
              href={job.form_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </a>
          ) : (
            <>
              <button
                disabled
                className="inline-block bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed opacity-70"
                title="You are not eligible (CGPA too low)"
              >
                Apply Now
              </button>
              <p className="text-red-600 text-sm mt-2 font-medium">
                 You are not eligible — CGPA below required minimum (
                {cgpa} / {job.cgpa_eligibility})
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const JobGet = () => {
  const [jobs, setJobs] = useState([]);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Filters
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
        const res = await axios.get(`${API_URL}/api/jobs/get-jobs`);
        setJobs(Array.isArray(res.data) ? res.data : []);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filtering
  const filteredJobs = jobs.filter((job) => {
  // --- 1. Search by designation OR company ---
  const matchesSearch =
    !searchTerm ||
    job.job_designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_name?.toLowerCase().includes(searchTerm.toLowerCase());

  // --- 2. Employment Type ---
  const matchesEmployment =
    employmentFilter === "all" ||
    job.type_of_employment?.toLowerCase() === employmentFilter.toLowerCase();

  // --- 3. Batch ---
  const matchesBatch =
    batchFilter === "all" || job.batch?.includes(Number(batchFilter));

  // --- 4. Work Location ---
  const matchesLocation =
    locationFilter === "all" ||
    job.work_location?.toLowerCase() === locationFilter.toLowerCase();

  // --- 5. CTC Range ---
  let matchesCtc = true;
  if (ctcFilter !== "all" && job.ctc) {
    const ctcValue = parseFloat(job.ctc); // assumes format like "8 LPA"
    if (!isNaN(ctcValue)) {
      if (ctcFilter === "lt5" && ctcValue >= 5) matchesCtc = false;
      if (ctcFilter === "5to10" && (ctcValue < 5 || ctcValue > 10))
        matchesCtc = false;
      if (ctcFilter === "gt10" && ctcValue <= 10) matchesCtc = false;
    }
  }

  // --- 6. Deadline ---
  let matchesDeadline = true;
  if (deadlineFilter !== "all" && job.application_deadline) {
    const now = new Date();
    const deadline = new Date(job.application_deadline);

    if (deadlineFilter === "active" && deadline < now) matchesDeadline = false;
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
});

  const handleApply = (job) => {
    if (job.form_link) {
      window.open(job.form_link, "_blank");
    } else {
      toast.info("Application link not available for this job.");
    }
  };

  const handleDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsPopup(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-[#DED9D9] min-h-screen p-8 font-[Figtree]">
      <div className="max-w-6xl mx-auto">
        {/* Header with Title */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Available Jobs</h1>
        </div>
<div className="flex flex-wrap gap-4 mb-8">

  {/* Search */}
  <div className="relative flex-1 min-w-[250px]">
    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      placeholder="Search by designation or company..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-300 
                 focus:outline-none focus:border-blue-500 transition-colors"
    />
  </div>

  {/* Batch */}
  <select
    value={batchFilter}
    onChange={(e) => setBatchFilter(e.target.value)}
    className="px-4 py-2 rounded-xl border-2 border-gray-300 
               focus:outline-none focus:border-blue-500 transition-colors"
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
    className="px-4 py-2 rounded-xl border-2 border-gray-300 
               focus:outline-none focus:border-blue-500 transition-colors"
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
    className="px-4 py-2 rounded-xl border-2 border-gray-300 
               focus:outline-none focus:border-blue-500 transition-colors"
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
    className="px-4 py-2 rounded-xl border-2 border-gray-300 
               focus:outline-none focus:border-blue-500 transition-colors"
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
    className="px-4 py-2 rounded-xl border-2 border-gray-300 
               focus:outline-none focus:border-blue-500 transition-colors"
  >
    <option value="all">All Deadlines</option>
    <option value="active">Active</option>
    <option value="soon">Closing Soon</option>
    <option value="expired">Expired</option>
  </select>

</div>
        <hr className="border-gray-400 mb-8" />

        {/* Job Cards */}
        <div className="space-y-6">
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
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Job Information */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {job.job_designation}
                        </h3>
                        <p className="text-lg font-semibold text-gray-700">
                          {job.company_name}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3 items-center text-gray-600 text-sm">
                        <div className="flex items-center bg-[#F5F7FC] rounded-3xl gap-2 py-1 px-3">
                          <FiBriefcase className="text-gray-400" />
                          <span>
                            {job.type_of_employment || "Not specified"}
                          </span>
                        </div>
                        <div className="flex items-center bg-[#F5F7FC] rounded-3xl gap-2 py-1 px-3">
                          <FiMapPin className="text-gray-400" />
                          <span>{job.work_location || "Remote"}</span>
                        </div>
                        <div className="flex items-center bg-[#F5F7FC] rounded-3xl gap-2 py-1 px-3">
                          <FiDollarSign className="text-gray-400" />
                          <span>
                            {job.ctc
                              ? `CTC: ${job.ctc}`
                              : job.stipend
                              ? `Stipend: ${job.stipend}`
                              : "Not specified"}
                          </span>
                        </div>
                        {job.application_deadline && (
                          <div className="flex items-center bg-[#F5F7FC] rounded-3xl gap-2 py-1 px-3">
                            <FiClock className="text-gray-400" />
                            <span>
                              Apply by: {formatDate(job.application_deadline)}
                            </span>
                          </div>
                        )}
                      </div>

                      {job.eligibility_criteria && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {job.eligibility_criteria}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 min-w-[120px]">
                      <button
                        onClick={() => handleApply(job)}
                        className="flex items-center justify-center gap-2 bg-[#029309] text-white px-4 py-2 rounded-lg hover:bg-[#03b40c] transition-colors"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => handleDetails(job)}
                        className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Details Popup */}
      {showDetailsPopup && selectedJob && (
        <Modal onClose={() => setShowDetailsPopup(false)}>
          <JobDetails job={selectedJob} />
        </Modal>
      )}
    </div>
  );
};

export default JobGet;