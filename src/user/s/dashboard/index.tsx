import { useState, useEffect } from "react";
import DashboardLayout from "../layout";
import { FiClock, FiCalendar, FiBook, FiCheckCircle } from "react-icons/fi";

function Dashboard() {

  const [stats, setStats] = useState({
    upcomingExams: 0,
    completedAssignments: 0,
    totalCourses: 0,
    examAverage: 0
  });

  useEffect(() => {
    // Simulate getting data from API
    setStats({
      upcomingExams: 3,
      completedAssignments: 8,
      totalCourses: 4,
      examAverage: 85
    });
  }, []);

  return (
    <DashboardLayout
      title="Student Dashboard"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full"> {/* Added w-full */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Upcoming Exams</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.upcomingExams}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiClock className="text-primary text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Completed Assignments</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.completedAssignments}</h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <FiCheckCircle className="text-amber-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Courses</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.totalCourses}</h3>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <FiBook className="text-emerald-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Exam Average</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.examAverage}%</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiCalendar className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area - placeholder for dashboard content */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Welcome to Your Student Dashboard</h2>
        <p className="text-slate-600">Here you can view your courses, upcoming exams, and academic progress.</p>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;