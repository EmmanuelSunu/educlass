
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";
import examsData from "../../l/exams/data/exams.json";
import { MdOutlineAccessTime } from "react-icons/md";
import { BsBook } from "react-icons/bs";
import { FiCalendar, FiClock } from "react-icons/fi";

// Import mock data for student classes
const studentClassIds = [1, 3, 5]; // Mock data: classes the student is enrolled in

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function StudentExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter exams to only show those from classes the student is enrolled in
    const studentExams = examsData.filter(exam => 
      studentClassIds.includes(exam.classId)
    );
    
    setExams(studentExams);
    setLoading(false);
  }, []);

  const handleExamClick = (examId) => {
    navigate(`/user/s/exams/details/${examId}`);
  };

  const getExamStatusLabel = (exam) => {
    const now = new Date();
    const dueDate = new Date(exam.dueDate + " " + exam.endTime);
    
    if (now > dueDate) {
      return { label: "Completed", color: "bg-green-100 text-green-800" };
    } else {
      return { label: "Available", color: "bg-blue-100 text-blue-800" };
    }
  };

  return (
    <DashboardLayout title="My Exams">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Available Exams</h2>
        <p className="text-sm text-gray-600">
          View and take exams from your enrolled classes
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-600">Loading exams...</div>
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-lg text-slate-600 mb-2">No exams available</div>
          <div className="text-sm text-slate-500">
            You don't have any exams scheduled at the moment.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map((exam) => {
            const status = getExamStatusLabel(exam);
            
            return (
              <div
                key={exam.id}
                className="bg-white rounded-lg shadow-sm p-5 cursor-pointer transition hover:shadow-md"
                onClick={() => handleExamClick(exam.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center text-primary">
                    <BsBook className="mr-2" size={18} />
                    <span className="text-xs font-medium uppercase">
                      {exam.type}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                
                <h3 className="font-medium text-gray-800 mb-1">{exam.title}</h3>
                <div className="text-sm text-gray-600 mb-3">{exam.className}</div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FiCalendar className="mr-2 text-gray-400" size={14} />
                    <span>{formatDate(exam.dueDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <MdOutlineAccessTime className="mr-2 text-gray-400" size={14} />
                    <span>{exam.duration}</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <FiClock className="mr-2 text-gray-400" size={14} />
                    <span>Available: {exam.startTime} - {exam.endTime}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default StudentExams;
