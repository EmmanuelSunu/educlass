
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";
import examsData from "../../l/exams/data/exams.json";

// Import mock data for student classes
const studentClassIds = [1, 3, 5]; // Mock data: classes the student is enrolled in

function StudentExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [pastExams, setPastExams] = useState([]);
  
  useEffect(() => {
    // Filter exams for classes the student is enrolled in
    const studentExams = examsData.filter(exam => 
      studentClassIds.includes(exam.classId)
    );
    
    const today = new Date();
    
    // Split into upcoming and past exams
    const upcoming = studentExams.filter(exam => 
      new Date(exam.dueDate) >= today
    );
    
    const past = studentExams.filter(exam => 
      new Date(exam.dueDate) < today
    );
    
    setExams(studentExams);
    setUpcomingExams(upcoming);
    setPastExams(past);
  }, []);

  const handleViewExam = (examId) => {
    navigate(`/user/s/exams/details/${examId}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <DashboardLayout
      title="My Exams"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      {/* Upcoming Exams */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Upcoming Exams</h2>
        
        {upcomingExams.length > 0 ? (
          <div className="space-y-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="border-b border-slate-100 pb-4 last:border-0 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-slate-800">{exam.title}</h3>
                  <div className="text-sm text-slate-500 mt-1">
                    <p>Due: {formatDate(exam.dueDate)}</p>
                    <p>Time: {exam.startTime} - {exam.endTime}</p>
                    <p>Duration: {exam.duration}</p>
                  </div>
                </div>
                <div>
                  {new Date(exam.dueDate) > new Date() && (
                    <button
                      onClick={() => handleViewExam(exam.id)}
                      className="px-3 py-1.5 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No upcoming exams.</p>
        )}
      </div>
      
      {/* Past Exams */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Past Exams</h2>
        
        {pastExams.length > 0 ? (
          <div className="space-y-4">
            {pastExams.map((exam) => (
              <div key={exam.id} className="border-b border-slate-100 pb-4 last:border-0 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-slate-800">{exam.title}</h3>
                  <div className="text-sm text-slate-500 mt-1">
                    <p>Date: {formatDate(exam.dueDate)}</p>
                    <p>Status: {exam.status === "completed" ? "Completed" : "Missed"}</p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleViewExam(exam.id)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
                  >
                    View Results
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No past exams.</p>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentExams;
