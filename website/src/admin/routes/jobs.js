import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ timestamp: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new job
router.post("/", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();

    res.status(201).json(savedJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update a job
router.put("/:id", async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // console.log(updatedJob)
    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a job by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
