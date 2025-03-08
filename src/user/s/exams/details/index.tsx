import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import examsData from "../../../l/exams/data/exams.json";
import { FiAlertCircle, FiClock } from "react-icons/fi";

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
    console.log("Looking for exam with ID:", id);
    let exam = examsData.find(e => e.id === Number(id));
    console.log("Found exam:", exam);

    if (exam) {
      setExamDetails(exam);

      // For testing purposes: Override the exam dates to make it available
      // In a real app, you would use the actual dates
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      
      // Make the exam available for testing
      setIsAvailable(true);
    } else {
      console.error("Exam not found with ID:", id);
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
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{examDetails.title}</h1>
            <span 
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isAvailable 
                  ? "bg-green-100 text-green-700" 
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {isAvailable ? "Available Now" : "Not Available"}
            </span>
          </div>
          <p className="text-slate-600">{examDetails.description || "No description provided."}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="text-xs text-slate-500 font-medium mb-1">Date</div>
            <div className="text-sm font-medium text-slate-700">{examDetails.dueDate}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="text-xs text-slate-500 font-medium mb-1">Duration</div>
            <div className="text-sm font-medium text-slate-700">{examDetails.duration}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="text-xs text-slate-500 font-medium mb-1">Start Time</div>
            <div className="text-sm font-medium text-slate-700">{examDetails.startTime}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="text-xs text-slate-500 font-medium mb-1">End Time</div>
            <div className="text-sm font-medium text-slate-700">{examDetails.endTime}</div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          {isAvailable ? (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Instructions</h2>
              <ul className="list-disc pl-5 text-slate-600 space-y-2 mb-6">
                <li>You are about to start the {examDetails.title}.</li>
                <li>You will have {examDetails.duration} to complete this exam.</li>
                <li>Make sure you have a stable internet connection.</li>
                <li>Do not refresh or close the browser window during the exam.</li>
                <li>Submit your answers before the time expires.</li>
              </ul>
              <button 
                onClick={handleStartExam} 
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2"
              >
                <FiClock />
                Start Exam
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <FiAlertCircle className="text-yellow-500 text-xl flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-700">Exam Not Available</h3>
                <p className="text-sm text-yellow-600 mt-1">
                  This exam is only available on {examDetails.dueDate} between {examDetails.startTime} and {examDetails.endTime}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ExamDetails;