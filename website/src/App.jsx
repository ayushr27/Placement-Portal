import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterNow from "./components/RegisterNow";
import StudentProfile from "./student/StudentProfile.jsx";
import AdminStaff from "./components/AdminStaff";
import StudentForm from "./components/detailform";
import Home from "./components/Home";
import OurTeam from "./components/OurTeam"


import JobPost from "./admin/JobPost.jsx";
import JobGet from "./student/JobGet.jsx";
import AdminHome from "./admin/AdminHome.jsx";
import StudentLogin from "./student/Student_login";
import AdminLogin from "./admin/AdminLogin.jsx";
import StudentHome from "./student/StudentHome.jsx";
import HomePageControl from "./admin/HomePageControl.jsx";
import StudentManagement from "./admin/StudentManagement.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterNow />} />
        <Route path="/adminstaff" element={<AdminStaff />} />
        <Route path="/a" element={<StudentForm />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/ourteam" element={<OurTeam />} />

        {/* Student routes (protected) */}
        <Route
          path="/student/:name"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile/:name"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/home"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentHome />
            </ProtectedRoute>
          }
        />

        {/* Admin routes (protected) */}
        <Route
          path="/admin/:name"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/control"
          element={
            <ProtectedRoute allowedRole="admin">
              <HomePageControl />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/management"
          element={
            <ProtectedRoute allowedRole="admin">
              <StudentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/post"
          element={
            <ProtectedRoute allowedRole="admin">
              <JobPost />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
