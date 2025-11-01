import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ForStudents from "./pages/ForStudents";
import ForRecruiters from "./pages/ForRecruiters";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<ForStudents />} />
        <Route path="/recruiters" element={<ForRecruiters />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;
