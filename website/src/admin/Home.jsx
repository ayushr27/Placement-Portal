import React from "react";
import ProfileCard from "./ProfileCard";
import JobBoard from "./JobBoard";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <ProfileCard profName="Admin" />
      <Link to="/admin/jobs">
        <button>Job Postings</button>
      </Link>
    </div>
  );
};

export default Home;
