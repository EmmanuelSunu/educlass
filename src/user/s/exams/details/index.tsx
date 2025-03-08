import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import examsData from "../../../l/exams/data/exams.json";
import { FiCalendar, FiClock } from "react-icons/fi";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function ExamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Find exam in standard exams data
    let exam = examsData.find(e => e.id === Number(id));

    // If not found, check additional test exams
    if (!exam) {
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
          className: "Introduction to Programming"
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
          className: "Database Systems"
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
      exam = additionalExams.find(e => e.id === Number(id));
    }

    if (exam) {
      setExamDetails(exam);

      // Check if exam is available (current time is within start and end time on the due date)
      const now = new Date();
      const examDate = new Date(exam.dueDate);
      const startTime = exam.startTime.split(':');
      const endTime = exam.endTime.split(':');

      const startDateTime = new Date(examDate);
      startDateTime.setHours(parseInt(startTime[0]), parseInt(startTime[1]), 0);

      const endDateTime = new Date(examDate);
      endDateTime.setHours(parseInt(endTime[0]), parseInt(endTime[1]), 0);

      setIsAvailable(now >= startDateTime && now <= endDateTime);
    }

    setLoading(false);
  }, [id]);

  const handleStartExam = () => {
    navigate(`/user/s/exams/take/${id}`);
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-600">Loading exam details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!examDetails) {
    return (
      <DashboardLayout title="Exam Not Found">
        <div className="bg-red-50 rounded-lg p-6 text-center">
          <p className="text-red-600">The requested exam could not be found.</p>
          <button
            onClick={() => navigate('/user/s/exams')}
            className="mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
          >
            Back to Exams
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={examDetails.title}>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{examDetails.title}</h2>
          <p className="text-gray-600 mb-4">{examDetails.className}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <FiCalendar className="mr-2" />
              <span>Date: {formatDate(examDetails.dueDate)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiClock className="mr-2" />
              <span>Duration: {examDetails.duration}</span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span>Available: {examDetails.startTime} - {examDetails.endTime}</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700">{examDetails.description}</p>
          </div>
        </div>

        {isAvailable ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Ready to Start</h2>
            <p className="text-green-700">
              This exam is currently available for you to take. You will have {examDetails.duration} once you start.
            </p>
            <button
              onClick={handleStartExam}
              className="mt-3 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Start Exam
            </button>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-6">
            <h2 className="text-lg font-semibold text-amber-800 mb-2">Exam Not Available Yet</h2>
            <p className="text-amber-700">
              This exam will be available on {formatDate(examDetails.dueDate)} from {examDetails.startTime} to {examDetails.endTime}.
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/user/s/exams')}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
        >
          Back to Exams
        </button>
      </div>
    </DashboardLayout>
  );
}

export default ExamDetails;