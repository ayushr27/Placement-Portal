import React, { useState, useEffect } from "react";
import axios from "axios";
import JobFormPopup from "./JobFormPopup";
import ModifyJobPopup from "./ModifyJobPopup";
import {
  FiEdit2,
  FiBriefcase,
  FiDollarSign,
  FiMapPin,
  FiClock,
  FiExternalLink,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobBoard = () => {
  const SERVER_URI = import.meta.env.VITE_SERVER_URI || "http://localhost:5000";
  const [jobs, setJobs] = useState([]);
  const [showPostPopup, setShowPostPopup] = useState(false);
  const [showModifyPopup, setShowModifyPopup] = useState(false);
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

  const handlePostJob = async (jobData) => {
    try {
      const res = await axios.post(`${SERVER_URI}/api/jobs`, jobData);
      setJobs([...jobs, res.data]);
      setShowPostPopup(false);
      toast.success("Job posted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post job");
    }
  };

  const handleModifyJob = async (updatedJob) => {
    try {
      const res = await axios.put(
        `${SERVER_URI}/api/jobs/${updatedJob._id}`,
        updatedJob
      );
      setJobs(jobs.map((job) => (job._id === updatedJob._id ? res.data : job)));
      setShowModifyPopup(false);
      toast.success("Job updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update job");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || job.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Job Board</h1>
            <p className="text-gray-600">
              {isLoading
                ? "Loading..."
                : `Showing ${filteredJobs.length} of ${jobs.length} jobs`}
            </p>
          </div>

          <button
            onClick={() => setShowPostPopup(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <FiEdit2 size={18} />
            Post a Job
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiBriefcase className="absolute left-3 top-3.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-4">
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">No jobs found</h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-100 p-3 rounded-lg">
                        <FiBriefcase className="text-indigo-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {job.title}
                        </h3>
                        <p className="text-lg text-gray-600">{job.company}</p>

                        <div className="mt-4 flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiDollarSign className="text-gray-500" />
                            <span>{job.salary || "Not specified"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiMapPin className="text-gray-500" />
                            <span>{job.location || "Remote"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiClock className="text-gray-500" />
                            <span>{job.type || "Full-time"}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                            {job.category || "General"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[180px]">
                    <a
                      href={`/applications/${job._id}`}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FiExternalLink size={16} />
                      Applications
                    </a>
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setShowModifyPopup(true);
                      }}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiEdit2 size={16} />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
    </div>
  );
};

export default JobBoard;
