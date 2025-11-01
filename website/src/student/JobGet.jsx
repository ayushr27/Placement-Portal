import React, { useState, useEffect } from "react";
import { FiBriefcase, FiMapPin, FiClock } from "react-icons/fi";
import { IndianRupee } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

// A simple modal component to wrap the job details
const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border-2 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

const JobDetails = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h2>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        {job.company}
      </h3>
      <p className="text-gray-600 mb-4">{job.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <span className="font-semibold">Website:</span>{" "}
          <a
            href={job.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {job.website}
          </a>
        </div>
        <div>
          <span className="font-semibold">Type:</span> {job.type}
        </div>
        <div>
          <span className="font-semibold">Location:</span> {job.location}
        </div>
        <div>
          <span className="font-semibold">Industry:</span> {job.industry}
        </div>
        <div>
          <span className="font-semibold">Salary:</span> {job.salary}
        </div>
        <div>
          <span className="font-semibold">Branch:</span> {job.branch}
        </div>
        <div>
          <span className="font-semibold">CGPA:</span> {job.cgpa}
        </div>
        <div>
          <span className="font-semibold">Gender:</span> {job.gender.join(", ")}
        </div>
        <div>
          <span className="font-semibold">Backlogs Allowed:</span>{" "}
          {job.backlogsAllowed}
        </div>
        {job.backlogCourses && (
          <div>
            <span className="font-semibold">Backlog Courses:</span>{" "}
            {job.backlogCourses}
          </div>
        )}
        <div>
          <span className="font-semibold">Deadline:</span>{" "}
          {new Date(job.deadline).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

const JobGet = () => {
  const SERVER_URI = import.meta.env.VITE_SERVER_URI || "http://localhost:5000";
  const [jobs, setJobs] = useState([]);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${SERVER_URI}/api/jobs`);
        setJobs(Array.isArray(res.data) ? res.data : res.data.jobs || []);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch jobs");
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || job.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleApply = (jobId) => {
    console.log(`Apply button clicked for job ID: ${jobId}`);
    // Add your application logic here, e.g., a redirection or form submission
    toast.info("Application functionality is not yet implemented.");
  };

  const handleDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsPopup(true);
  };

  return (
    <div className="bg-[#DED9D9] min-h-screen p-8 font-[Figtree]">
      <div className="max-w-4xl mx-auto">
        {/* Header with Title */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Jobs</h1>
        </div>
        <hr />
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
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-3xl shadow-lg border-2 border-solid p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 "
                >
                  <div className="flex flex-col md:flex-row w-full justify-between gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="text-gray-800 font-semibold text-lg">
                        {job.company}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {job.title}
                      </div>

                      <div className="flex flex-wrap gap-3 items-center text-gray-600 space-x-4 text-sm mt-2">
                        <div className="flex items-center bg-[#F5F7FC] rounded-3xl gap-1 py-1 object-contain px-2">
                          <FiBriefcase className="text-gray-400" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex bg-[#F5F7FC] rounded-3xl items-center object-contain gap-1 py-1 px-2">
                          <FiMapPin className="text-gray-400" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex bg-[#F5F7FC] rounded-3xl items-center object-contain gap-1 py-1 px-2">
                          <IndianRupee className="text-gray-400 w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex bg-[#F5F7FC] rounded-3xl items-center object-contain gap-1 py-1 px-2">
                          <FiClock className="text-gray-400 w-4 h-4" />
                          <span>
                            {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[120px]">
                      <button
                        onClick={() => handleApply(job._id)}
                        className="flex items-center justify-center gap-2 bg-[#029309] text-white px-2 py-2 rounded-lg hover:bg-[#03b40c] active:bg-[#029309] transition-colors"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => handleDetails(job)}
                        className="flex items-center justify-center gap-2  bg-black active:bg-black text-white hover:bg-gray-900 px-2 py-2 rounded-lg transition-colors"
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
      {/* Popups */}
      {showDetailsPopup && selectedJob && (
        <Modal onClose={() => setShowDetailsPopup(false)}>
          <JobDetails
            job={selectedJob}
            onClose={() => setShowDetailsPopup(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default JobGet;
