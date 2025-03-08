
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import examsData from "../../../l/exams/data/exams.json";

function ExamDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  useEffect(() => {
    if (id) {
      const exam = examsData.find(
        (exam) => exam.id === Number(id)
      );
      
      if (exam) {
        setExamDetails(exam);
        
        // Check if exam is available (between start and end time)
        const now = new Date();
        const examDate = new Date(exam.dueDate);
        const isSameDay = now.toDateString() === examDate.toDateString();
        
        // Parse times (assuming format like "10:00")
        const [startHour, startMinute] = exam.startTime.split(':').map(Number);
        const [endHour, endMinute] = exam.endTime.split(':').map(Number);
        
        const startDateTime = new Date(examDate);
        startDateTime.setHours(startHour, startMinute, 0);
        
        const endDateTime = new Date(examDate);
        endDateTime.setHours(endHour, endMinute, 0);
        
        // Check if current time is within exam window
        const isTimeAvailable = now >= startDateTime && now <= endDateTime;
        
        setIsAvailable(isSameDay && isTimeAvailable);
        setIsCompleted(exam.status === "completed");
      } else {
        // Exam not found
        navigate('/user/s/exams');
      }
    }
  }, [id, navigate]);

  const handleStartExam = () => {
    navigate(`/user/s/exams/take/${id}`);
  };

  if (!examDetails) {
    return (
      <DashboardLayout
        title="Loading..."
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-600">Loading exam details...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <DashboardLayout
      title="Exam Details"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="mb-6 border-b border-slate-200 pb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{examDetails.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <div>
              <span className="font-medium">Date:</span> {formatDate(examDetails.dueDate)}
            </div>
            <div>
              <span className="font-medium">Time:</span> {examDetails.startTime} - {examDetails.endTime}
            </div>
            <div>
              <span className="font-medium">Duration:</span> {examDetails.duration}
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              <span className={`px-2 py-1 rounded-full text-xs ${
                isCompleted ? "bg-green-100 text-green-800" : 
                isAvailable ? "bg-blue-100 text-blue-800" : 
                "bg-gray-100 text-gray-800"
              }`}>
                {isCompleted ? "Completed" : isAvailable ? "Available Now" : "Upcoming"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Description</h2>
          <p className="text-slate-600">{examDetails.description || "No description provided."}</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Instructions</h2>
          <ul className="list-disc list-inside text-slate-600 space-y-1">
            <li>You will have {examDetails.duration} to complete this exam once started.</li>
            <li>The exam consists of {examDetails.questions.length} questions.</li>
            <li>You can only take this exam once.</li>
            <li>Make sure you have a stable internet connection before starting.</li>
          </ul>
        </div>
        
        {isCompleted ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Exam Completed</h2>
            <p className="text-green-700">You have already completed this exam.</p>
            <button
              onClick={() => navigate(`/user/s/exams/results/${id}`)}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              View Results
            </button>
          </div>
        ) : isAvailable ? (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Exam Available</h2>
            <p className="text-blue-700">
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

export default ExamDetailsPage;
