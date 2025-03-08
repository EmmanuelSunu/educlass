
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";
import ExamCard from "../../../components/examCard";
import examsData from "../exams/data/exams.json";
import { BsCalendarEvent, BsClockHistory, BsGraphUp, BsPeople } from "react-icons/bs";

function Dashboard() {
  const navigate = useNavigate();
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [ongoingExams, setOngoingExams] = useState([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    totalClasses: 0,
    totalStudents: 0,
    completedExams: 0
  });
  
  useEffect(() => {
    // Simulate getting data from API
    const today = new Date();
    
    // Process exams data
    const upcoming = examsData.filter(exam => 
      new Date(exam.dueDate) > today && exam.status === "scheduled"
    ).slice(0, 3);
    
    const ongoing = examsData.filter(exam => 
      exam.status === "in-progress" || 
      (new Date(exam.dueDate).toDateString() === today.toDateString())
    ).slice(0, 2);
    
    setUpcomingExams(upcoming);
    setOngoingExams(ongoing);
    
    setStats({
      totalExams: examsData.length,
      totalClasses: 5,
      totalStudents: 150,
      completedExams: examsData.filter(exam => exam.status === "completed").length
    });
  }, []);

  const handleAddHeadbarButton = () => {
    navigate('/user/l/exams/create');
  };

  const handleViewExam = (examId) => {
    navigate(`/user/l/exams/details/${examId}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <DashboardLayout
      title="Dashboard"
      showAddHeadbarButton={true}
      onAddHeadbarButton={handleAddHeadbarButton}
      buttonTitle="Add Exams"
    >
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Exams</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.totalExams}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BsGraphUp className="text-primary text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Classes</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.totalClasses}</h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <BsCalendarEvent className="text-amber-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Students</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.totalStudents}</h3>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <BsPeople className="text-emerald-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Completed Exams</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.completedExams}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BsClockHistory className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upcoming Exams */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Upcoming Exams</h2>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            {upcomingExams.length > 0 ? (
              <div className="space-y-4">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="flex justify-between items-center border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div>
                      <h3 className="font-medium text-slate-800">{exam.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">Due: {formatDate(exam.dueDate)}</p>
                    </div>
                    <button
                      onClick={() => handleViewExam(exam.id)}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium hover:bg-primary/20"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No upcoming exams.</p>
            )}
          </div>
          
          {/* Recent Activity Section */}
          <h2 className="text-lg font-semibold text-slate-800 mb-4 mt-6">Recent Activities</h2>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <BsCalendarEvent className="text-primary" />
                </div>
                <div>
                  <p className="text-slate-800">You created "Calculus Final Exam"</p>
                  <p className="text-xs text-slate-500">Today, 10:30 AM</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-emerald-100 p-2 rounded-full mr-3">
                  <BsPeople className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-800">5 new students joined "Web Technologies"</p>
                  <p className="text-xs text-slate-500">Yesterday, 2:15 PM</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-full mr-3">
                  <BsGraphUp className="text-amber-600" />
                </div>
                <div>
                  <p className="text-slate-800">Graded 15 submissions for "Database Management"</p>
                  <p className="text-xs text-slate-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Ongoing Exams & Quick Stats */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Ongoing Exams</h2>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 mb-6">
            {ongoingExams.length > 0 ? (
              <div className="space-y-4">
                {ongoingExams.map((exam) => (
                  <div key={exam.id} className="border-l-4 border-amber-500 pl-3 py-2">
                    <h3 className="font-medium text-slate-800">{exam.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-slate-500">Time: {exam.startTime} - {exam.endTime}</p>
                      <button
                        onClick={() => handleViewExam(exam.id)}
                        className="px-2 py-1 bg-amber-100 text-amber-600 rounded text-xs font-medium hover:bg-amber-200"
                      >
                        Monitor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No ongoing exams.</p>
            )}
          </div>
          
          {/* Upcoming Schedule */}
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Today's Schedule</h2>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span className="text-xs font-medium text-slate-500 mr-2">10:00 AM</span>
                <span className="text-sm text-slate-700">Operating Systems Class</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-xs font-medium text-slate-500 mr-2">01:00 PM</span>
                <span className="text-sm text-slate-700">Faculty Meeting</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-xs font-medium text-slate-500 mr-2">03:30 PM</span>
                <span className="text-sm text-slate-700">Database Lab Session</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/user/l/schedules')}
              className="w-full mt-4 text-center text-primary text-sm font-medium hover:underline"
            >
              View Full Schedule
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
