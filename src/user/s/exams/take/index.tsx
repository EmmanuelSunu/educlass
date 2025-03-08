
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import examsData from "../../../l/exams/data/exams.json";

function TakeExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load exam details
  useEffect(() => {
    if (id) {
      const exam = examsData.find(
        (exam) => exam.id === Number(id)
      );
      
      if (exam) {
        setExamDetails(exam);
        
        // Initialize responses object
        const initialResponses = {};
        exam.questions.forEach((question) => {
          initialResponses[question.id] = "";
        });
        setResponses(initialResponses);
        
        // Parse duration (assuming format like "1 hour" or "30 minutes")
        let minutes = 0;
        if (exam.durationHours) {
          minutes += exam.durationHours * 60;
        }
        if (exam.durationMinutes) {
          minutes += exam.durationMinutes;
        }
        
        setTimeRemaining(minutes * 60); // Convert to seconds
      } else {
        // Exam not found
        navigate('/user/s/exams');
      }
    }
  }, [id, navigate]);

  // Start the exam timer
  useEffect(() => {
    if (!examStarted || !timeRemaining) return;

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Auto-submit when time runs out
          handleSubmitExam();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeRemaining]);

  // Format time remaining as MM:SS
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle response changes
  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Navigate to next or previous question
  const handleNavigateQuestion = (direction) => {
    if (direction === 'next' && currentQuestionIndex < examDetails.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Start the exam
  const handleStartExam = () => {
    setExamStarted(true);
  };

  // Submit the exam
  const handleSubmitExam = useCallback(() => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // In a real app, you would send the responses to the backend here
    console.log("Submitting exam responses:", responses);
    
    // Simulate submission delay
    setTimeout(() => {
      // Navigate to results page
      navigate(`/user/s/exams/results/${id}`);
    }, 1500);
  }, [id, navigate, responses, isSubmitting]);

  if (!examDetails) {
    return (
      <DashboardLayout
        title="Loading..."
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-600">Loading exam...</div>
        </div>
      </DashboardLayout>
    );
  }

  // If exam hasn't started yet, show start screen
  if (!examStarted) {
    return (
      <DashboardLayout
        title={examDetails.title}
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">{examDetails.title}</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Exam Instructions</h2>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>You will have {examDetails.duration} to complete this exam.</li>
              <li>The exam consists of {examDetails.questions.length} questions.</li>
              <li>Once you start, the timer cannot be paused.</li>
              <li>Make sure you save your answers before navigating between questions.</li>
              <li>Your answers will be auto-submitted when the time expires.</li>
            </ul>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => navigate(`/user/s/exams/details/${id}`)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
            >
              Back
            </button>
            
            <button
              onClick={handleStartExam}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Start Exam
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Get current question
  const currentQuestion = examDetails.questions[currentQuestionIndex];

  return (
    <DashboardLayout
      title={examDetails.title}
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="sticky top-0 z-10 bg-white shadow-md border-b border-slate-200 p-4 mb-6 flex justify-between items-center">
        <div className="text-slate-800">
          Question {currentQuestionIndex + 1} of {examDetails.questions.length}
        </div>
        <div className="flex items-center">
          <div className={`font-mono text-lg font-bold ${
            timeRemaining < 300 ? "text-red-600 animate-pulse" : "text-slate-800"
          }`}>
            Time Remaining: {formatTimeRemaining()}
          </div>
          <button
            onClick={handleSubmitExam}
            className="ml-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Exam"}
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-slate-800 mb-4">
          {currentQuestion.questionText}
        </h2>
        
        <div className="mb-6">
          <textarea
            value={responses[currentQuestion.id] || ""}
            onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          ></textarea>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => handleNavigateQuestion('prev')}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 disabled:opacity-50"
            disabled={currentQuestionIndex === 0}
          >
            Previous Question
          </button>
          
          <button
            onClick={() => handleNavigateQuestion('next')}
            className={`px-4 py-2 ${
              currentQuestionIndex === examDetails.questions.length - 1
                ? "bg-primary text-white"
                : "bg-slate-200 text-slate-700"
            } rounded-md hover:opacity-90`}
            disabled={currentQuestionIndex === examDetails.questions.length - 1}
          >
            Next Question
          </button>
        </div>
      </div>
      
      {/* Question Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-md font-medium text-slate-800 mb-4">Question Navigation</h3>
        <div className="flex flex-wrap gap-2">
          {examDetails.questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                index === currentQuestionIndex
                  ? "bg-primary text-white"
                  : responses[question.id]
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TakeExamPage;
