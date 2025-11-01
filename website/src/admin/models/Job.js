import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  company: String,
  title: String,
  website: String,
  type: String,
  location: String,
  category: String,
  salary: String,
  branch: String,
  description: String,
  cgpa: String,
  gender: [String],
  backlogsAllowed: Boolean,
  backlogCourses: String,
  deadline: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
