import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login";
import Dashboard from "./user/l/dashboard";
import LecturerSchedule from "./user/l/schedules/";
import LecturerExams from "./user/l/exams/";
import LecturerGrading from "./user/l/grading/";
import LecturerSettings from "./user/l/settings";
import LecturerClass from "./user/l/class";
import ExamDetailsPage from "./user/l/exams/details";
function App() {
  return (
    <Router>
      <>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/user/l/dashboard" element={<Dashboard />} />
            <Route path="/user/l/schedules" element={<LecturerSchedule />} />
            <Route path="/user/l/exams" element={<LecturerExams />} />
            <Route path="/user/l/grading" element={<LecturerGrading />} />
            <Route path="/user/l/settings" element={<LecturerSettings />} />
            <Route path="/user/l/class" element={<LecturerClass />} />
            <Route path="/exams/details/:id" element={<ExamDetailsPage />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
