import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet as RouterOutlet,
  Navigate,
} from "react-router-dom";
import Login from "./login";
import Dashboard from "./user/l/dashboard";
import LecturerSchedule from "./user/l/schedules/";
import LecturerExams from "./user/l/exams/";
import LecturerGrading from "./user/l/grading/";
import LecturerSettings from "./user/l/settings";
import LecturerClass from "./user/l/class";
import ExamDetailsPage from "./user/l/exams/details";
import CreateExam from "./user/l/exams/create";

// Student imports
import StudentDashboard from "./user/s/dashboard";
import StudentExams from "./user/s/exams";
import StudentSettings from "./user/s/settings";
import StudentExamDetails from "./user/s/exams/details";
import StudentExamTake from "./user/s/exams/take";
import StudentExamResults from "./user/s/exams/results";
import StudentResults from "./user/s/results";
import StudentResultDetails from "./user/s/results/details";
import StudentCalender from "./user/s/schedules";
import StudentClasses from "./user/s/classes";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Lecturer Routes */}
        <Route path="/user/l/dashboard" element={<Dashboard />} />
        <Route path="/user/l/schedules" element={<LecturerSchedule />} />
        <Route path="/user/l/exams" element={<LecturerExams />} />
        <Route path="/user/l/exams/create" element={<CreateExam />} />
        <Route path="/user/l/exams/create/:id" element={<CreateExam />} />
        <Route path="/user/l/exams/details/:id" element={<ExamDetailsPage />} />
        <Route path="/user/l/grading" element={<LecturerGrading />} />
        <Route path="/user/l/settings" element={<LecturerSettings />} />
        <Route path="/user/l/class" element={<LecturerClass />} />

        {/* Student Routes */}
        <Route path="/user/s" element={<RouterOutlet />}>
          <Route index element={<Navigate to="/user/s/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="calendar" element={<StudentCalender />} />
          <Route path="exams" element={<StudentExams />} />
          <Route path="exams/take/:id" element={<StudentExamTake />} />
          <Route path="exams/details/:id" element={<StudentExamDetails />} />
          <Route path="exams/results/:id" element={<StudentExamResults />} />
          <Route path="classes" element={<StudentClasses />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
