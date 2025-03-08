import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import StudentSchedule from "./user/s/schedules";
import StudentExams from "./user/s/exams";
import StudentSettings from "./user/s/settings";

function App() {
  return (
    <Router>
      <>
        <Routes>
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
            <Route path="/exams/details/:id" element={<ExamDetailsPage />} />

            {/* Student Routes */}
            <Route path="/user/s/dashboard" element={<StudentDashboard />} />
            <Route path="/user/s/schedules" element={<StudentSchedule />} />
            <Route path="/user/s/exams" element={<StudentExams />} />
            <Route path="/user/s/exams/details/:id" element={<React.Suspense fallback={<div>Loading...</div>}><React.lazy(() => import('./user/s/exams/details'))  /></React.Suspense>} />
            <Route path="/user/s/exams/take/:id" element={<React.Suspense fallback={<div>Loading...</div>}><React.lazy(() => import('./user/s/exams/take'))  /></React.Suspense>} />
            <Route path="/user/s/exams/results/:id" element={<React.Suspense fallback={<div>Loading...</div>}><React.lazy(() => import('./user/s/exams/results'))  /></React.Suspense>} />
            <Route path="/user/s/settings" element={<StudentSettings />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;