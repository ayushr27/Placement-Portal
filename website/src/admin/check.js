fetch("http://localhost:5000/api/jobs", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    company: "TechCorp",
    title: "Software Engineer",
    website: "https://techcorp.com",
    type: "Full-time",
    location: "Remote",
    category: "Engineering",
    salary: "10 LPA",
    branch: "CSE",
    description: "Build cool stuff.",
    cgpa: "7.0",
    gender: ["Any"],
    backlogsAllowed: false,
    backlogCourses: "",
    deadline: "2025-08-31",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log("Job posted:", data))
  .catch((err) => console.error("Error posting job:", err));
