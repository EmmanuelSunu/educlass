import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./data/auth/context";
import Login from "./login";
import Dashboard from "./user/l/dashboard";
import LecturerSchedule from "./user/l/schedules/";
import LecturerExams from "./user/l/exams/";
import LecturerGrading from "./user/l/grading/";
import LecturerSettings from "./user/l/settings";
import LecturerClass from "./user/l/class";
import ExamDetailsPage from "./user/l/exams/details";
import CreateExam from "./user/l/exams/create";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./admin/pages/Dashboard";
import CoursesList from "./admin/pages/courses/CoursesList";
import CourseForm from "./admin/pages/courses/CourseForm";
import AnalyticsPage from "./admin/pages/analytics/AnalyticsPage";
import StudentAnalytics from "./admin/pages/analytics/StudentAnalytics";
import CourseAnalytics from "./admin/pages/analytics/CourseAnalytics";
import ProgramList from "./admin/pages/programs/ProgramList";
import ProgramForm from "./admin/pages/programs/ProgramForm";
import ProgramDetails from "./admin/pages/programs/ProgramDetails";
import LecturerList from "./admin/pages/lecturers/LecturerList";
import LecturerForm from "./admin/pages/lecturers/LecturerForm";
import StudentList from "./admin/pages/students/StudentList";
import StudentForm from "./admin/pages/students/StudentForm";
import AdminLayout from "./admin/layout";

// Student imports
import StudentDashboard from "./user/s/dashboard";
import StudentExams from "./user/s/exams";
import StudentSettings from "./user/s/settings";
import StudentExamDetails from "./user/s/exams/details";
import StudentExamTake from "./user/s/exams/take";
import StudentResults from "./user/s/results";
import StudentResultDetails from "./user/s/results/details";
import StudentCalender from "./user/s/schedules";
import StudentClasses from "./user/s/classes";

const AdminRoutes = () => (
  <AdminLayout title="Admin Dashboard">
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="programs" element={<ProgramList />} />
      <Route path="programs/create" element={<ProgramForm />} />
      <Route path="programs/:id" element={<ProgramDetails />} />
      <Route path="programs/:id/edit" element={<ProgramForm />} />
      <Route path="lecturers" element={<LecturerList />} />
      <Route path="lecturers/create" element={<LecturerForm />} />
      <Route path="lecturers/:id/edit" element={<LecturerForm />} />
      <Route path="students" element={<StudentList />} />
      <Route path="students/create" element={<StudentForm />} />
      <Route path="students/:id/edit" element={<StudentForm />} />
      <Route path="courses" element={<CoursesList />} />
      <Route path="courses/create" element={<CourseForm />} />
      <Route path="courses/:id/edit" element={<CourseForm />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="analytics/students" element={<StudentAnalytics />} />
      <Route path="analytics/courses" element={<CourseAnalytics />} />
    </Routes>
  </AdminLayout>
)

const LecturerRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="schedules" element={<LecturerSchedule />} />
    <Route path="exams" element={<LecturerExams />} />
    <Route path="exams/create" element={<CreateExam />} />
    <Route path="exams/create/:id" element={<CreateExam />} />
    <Route path="exams/details/:id" element={<ExamDetailsPage />} />
    <Route path="grading" element={<LecturerGrading />} />
    <Route path="settings" element={<LecturerSettings />} />
    <Route path="class" element={<LecturerClass />} />
  </Routes>
);

const StudentRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<StudentDashboard />} />
    <Route path="schedules" element={<StudentCalender />} />
    <Route path="exams" element={<StudentExams />} />
    <Route path="exams/take/:id" element={<StudentExamTake />} />
    <Route path="exams/details/:id" element={<StudentExamDetails />} />
    <Route path="results" element={<StudentResults />} />
    <Route path="results/:examId" element={<StudentResultDetails />} />
    <Route path="classes" element={<StudentClasses />} />
    <Route path="settings" element={<StudentSettings />} />
  </Routes>
);

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes location={location}>
      <Route path="/" element={<Login />} />
      
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminRoutes />
        </ProtectedRoute>
      } />
      
      <Route path="/user/l/*" element={
        <ProtectedRoute allowedRoles={['lecturer']}>
          <LecturerRoutes />
        </ProtectedRoute>
      } />
      
      <Route path="/user/s/*" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentRoutes />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
