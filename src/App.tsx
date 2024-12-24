import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login";
import Overview from "./user/l/overview";
import LecturerSchedule from "./user/l/schedules/";
import LecturerExams from "./user/l/exams/";
import LecturerGrading from "./user/l/grading/";
import LecturerSettings from "./user/l/settings";
import LecturerStudents from "./user/l/students";
function App() {
  return (
    <Router>
      <>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/user/l/overview" element={<Overview />} />
            <Route path="/user/l/schedules" element={<LecturerSchedule />} />
            <Route path="/user/l/exams" element={<LecturerExams />} />
            <Route path="/user/l/grading" element={<LecturerGrading />} />
            <Route path="/user/l/settings" element={<LecturerSettings />} />
            <Route path="/user/l/students" element={<LecturerStudents />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
