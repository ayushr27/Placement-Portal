import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JobBoard from "./admin/JobBoard.jsx";
import Home from "./admin/Home.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/admin/home" element={<Home />} />
        <Route path="/admin/jobs" element={<JobBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
