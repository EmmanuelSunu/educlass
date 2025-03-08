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
  const [availableExams, setAvailableExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter exams to only show those from classes the student is enrolled in
    const studentExams = examsData.filter(exam => 
      studentClassIds.includes(exam.classId)
    );

    // Add more test exams for the student
    const additionalExams = [
      {
        id: 201,
        title: "Midterm Programming Exam",
        type: "exam",
        duration: "2 hours",
        durationHours: 2,
        durationMinutes: 0,
        startTime: "09:00",
        endTime: "12:00",
        status: "scheduled",
        dueDate: "2023-11-15",
        description: "Midterm programming concepts exam covering arrays, loops, and functions",
        classId: 1,
        className: "Introduction to Programming",
        questions: [
          { text: "Question 1?", options: ["A", "B", "C", "D"] },
          { text: "Question 2?", options: ["A", "B", "C", "D"] },
          { text: "Question 3?", options: ["A", "B", "C", "D"] }
        ]
      },
      {
        id: 202,
        title: "Database Design Quiz",
        type: "test",
        duration: "30 minutes",
        durationHours: 0,
        durationMinutes: 30,
        startTime: "14:00",
        endTime: "16:00",
        status: "scheduled",
        dueDate: "2023-11-20",
        description: "Quick quiz on database normalization and SQL queries",
        classId: 3,
        className: "Database Systems",
        questions: [
          { text: "Question 4?", options: ["A", "B", "C", "D"] },
          { text: "Question 5?", options: ["A", "B", "C", "D"] }
        ]
      },
      {
        id: 203,
        title: "Web Development Final Project",
        type: "assignment",
        duration: "48 hours",
        durationHours: 48,
        durationMinutes: 0,
        startTime: "00:00",
        endTime: "23:59",
        status: "scheduled",
        dueDate: "2023-12-05",
        description: "Final project submission for the Web Development course",
        classId: 5,
        className: "Web Development"
      }
    ];

    setAvailableExams([...studentExams, ...additionalExams]);
    setLoading(false);
  }, []);

  const handleExamClick = (exam) => {
    navigate(`/user/s/exams/details/${exam.id}`, { state: { exam } });
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
      ) : availableExams.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">No exams available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {availableExams.map((exam) => {
            const statusInfo = getExamStatusLabel(exam);

            return (
              <div
                key={exam.id}
                onClick={() => handleExamClick(exam)}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-800">
                    {exam.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  {exam.className}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCalendar className="mr-2" />
                    <span>Due: {formatDate(exam.dueDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiClock className="mr-2" />
                    <span>{exam.duration}</span>
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