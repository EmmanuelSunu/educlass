
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
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import examsData from "../../../l/exams/data/exams.json";
import { FiClock, FiSave, FiSend } from "react-icons/fi";

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0'),
  ].join(':');
}

function ExamTakePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [saving, setSaving] = useState(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState("");

  // Load exam data
  useEffect(() => {
    if (id) {
      const foundExam = examsData.find((e) => e.id === Number(id));
      if (foundExam) {
        setExam(foundExam);
        
        // Initialize empty answers for all questions
        const initialAnswers = {};
        foundExam.questions?.forEach((question, index) => {
          initialAnswers[index] = "";
        });
        setAnswers(initialAnswers);
        
        // Set timer based on exam duration
        // Convert duration (e.g. "1 hour 30 minutes") to seconds
        let seconds = 0;
        if (foundExam.durationHours) {
          seconds += foundExam.durationHours * 3600;
        }
        if (foundExam.durationMinutes) {
          seconds += foundExam.durationMinutes * 60;
        }
        
        // If no specific duration data, default to 1 hour
        if (seconds === 0) {
          seconds = 3600;
        }
        
        setTimeRemaining(seconds);
      } else {
        navigate("/user/s/exams");
      }
    }
    setLoading(false);
  }, [id, navigate]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Auto-submit when time is up
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-save every 30 seconds
  const autoSave = useCallback(() => {
    if (Object.keys(answers).length > 0) {
      setSaving(true);
      // Simulate saving to server
      setTimeout(() => {
        setSaving(false);
        setAutoSaveMessage("Answers auto-saved at " + new Date().toLocaleTimeString());
        
        // Clear auto-save message after 3 seconds
        setTimeout(() => {
          setAutoSaveMessage("");
        }, 3000);
      }, 1000);
    }
  }, [answers]);

  useEffect(() => {
    const autoSaveInterval = setInterval(autoSave, 30000);
    return () => clearInterval(autoSaveInterval);
  }, [autoSave]);

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: e.target.value,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (exam?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setSaving(true);
    
    // Simulate submission to server
    setTimeout(() => {
      setSaving(false);
      // Navigate to results page
      navigate(`/user/s/exams/results/${id}`);
    }, 1500);
  };

  if (loading || !exam) {
    return (
      <DashboardLayout title="Taking Exam">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-600">Loading exam...</div>
        </div>
      </DashboardLayout>
    );
  }

  const currentQuestion = exam.questions?.[currentQuestionIndex];

  return (
    <DashboardLayout title={exam.title}>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <FiClock className="text-red-500 mr-2" />
            <span className={`font-mono text-lg ${timeRemaining < 300 ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium text-gray-800">
              Question {currentQuestionIndex + 1} of {exam.questions?.length || 0}
            </h2>
            {autoSaveMessage && (
              <div className="text-sm text-green-600">
                {autoSaveMessage}
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <p className="text-gray-800">{currentQuestion?.text || "No question available"}</p>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer:
          </label>
          <textarea
            value={answers[currentQuestionIndex] || ""}
            onChange={handleAnswerChange}
            className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Type your answer here..."
          ></textarea>
        </div>

        <div className="flex flex-wrap justify-between items-center">
          <div className="flex space-x-3 mb-3 md:mb-0">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 border rounded-md ${
                currentQuestionIndex === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === (exam.questions?.length || 0) - 1}
              className={`px-4 py-2 border rounded-md ${
                currentQuestionIndex === (exam.questions?.length || 0) - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>

          <div className="w-full md:w-auto flex space-x-3">
            <button
              onClick={autoSave}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <FiSave className="mr-2" />
              Save
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              <FiSend className="mr-2" />
              {saving ? "Submitting..." : "Submit Exam"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-3">Question Navigation</h2>
        <div className="grid grid-cols-10 gap-2">
          {exam.questions?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`h-10 w-10 rounded-md flex items-center justify-center ${
                index === currentQuestionIndex
                  ? "bg-primary text-white"
                  : answers[index]
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
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

export default ExamTakePage;
