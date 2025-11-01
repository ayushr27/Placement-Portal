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
} from "react-icons/fi";
import { IndianRupee } from "lucide-react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from "axios";
import JobFormPopup from "./JobFormPopup";
import ModifyJobPopup from "./ModifyJobPopup";
const JobPost = () => {
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

  // New function to handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${SERVER_URI}/api/jobs/${jobId}`);
        setJobs(jobs.filter((job) => job._id !== jobId));
        toast.success("Job deleted successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete job");
      }
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
    <div className="bg-[#DED9D9] min-h-screen p-8 font-[Figtree]">
      <div className="max-w-4xl mx-auto">
        {/* Header with Title and Create Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Jobs</h1>
          <button
            onClick={() => setShowPostPopup(true)}
            className="flex items-center gap-2 px-4 py-1 bg-black active:bg-black text-white rounded-xl shadow-lg hover:bg-gray-900 transition-colors"
          >
            <span className="text-xl">+</span> create
          </button>
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
                  className="bg-white rounded-3xl border-2 border-solid p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 "
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
                      </div>
                    </div>

                    {/* Eligibility Criteria section based on the new schema */}

                    <div className="flex-1 border-l-2 pl-4 md:border-l-0 md:pl-0 md:border-t-2 md:pt-4 border-gray-200">
                      <h3 className="font-semibold text-gray-700">
                        Eligibility Criteria
                      </h3>
                      <hr />
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {job.cgpa && <li>CGPA above {job.cgpa}</li>}
                        {job.backlogsAllowed === "No" && <li>No Backlogs</li>}
                        {job.gender && job.gender.length > 0 && (
                          <li>{job.gender.join(" & ")} only</li>
                        )}
                        {job.deadline && (
                          <li>
                            Apply before:{" "}
                            {new Date(job.deadline).toLocaleDateString()}
                          </li>
                        )}
                      </ul>
                      {job.backlogCourses && (
                        <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-blue-800 text-xs">
                          Backlog Courses: {job.backlogCourses}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 min-w-[120px]">
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowModifyPopup(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white px-2 py-2 rounded-lg active:bg-black transition-colors"
                      >
                        <FiEdit2 size={16} />
                        Edit
                      </button>
                      <button className="flex items-center w-fit ustify-center gap-2 bg-white border-2 border-solid  px-2 py-1 hover:bg-gray-200 active:bg-white rounded-lg  transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                          className="bg-white hover:bg-gray-200 active:bg-white h-7"
                        >
                          <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm60.1 106.5L224 336l60.1 93.5c5.1 8-.6 18.5-10.1 18.5h-34.9c-4.4 0-8.5-2.4-10.6-6.3C208.9 405.5 192 373 192 373c-6.4 14.8-10 20-36.6 68.8-2.1 3.9-6.1 6.3-10.5 6.3H110c-9.5 0-15.2-10.5-10.1-18.5l60.3-93.5-60.3-93.5c-5.2-8 .6-18.5 10.1-18.5h34.8c4.4 0 8.5 2.4 10.6 6.3 26.1 48.8 20 33.6 36.6 68.5 0 0 6.1-11.7 36.6-68.5 2.1-3.9 6.2-6.3 10.6-6.3H274c9.5-.1 15.2 10.4 10.1 18.4zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
                        </svg>
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

export default JobPost;
