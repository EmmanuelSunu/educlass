import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import examsData from "../../../l/exams/data/exams.json";
import { FiClock, FiSave, FiSend, FiAlertTriangle } from "react-icons/fi";

function TakeExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState(null);
  const [responses, setResponses] = useState({});
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [examStatus, setExamStatus] = useState("loading"); // loading, not-started, in-progress, time-error
  const [autoSaveInterval, setAutoSaveInterval] = useState(null);
  const textareaRef = useRef(null);

  // Format time from seconds to MM:SS or HH:MM:SS
  const formatTimeRemaining = () => {
    if (timeRemaining <= 0) return "00:00";

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Helper function to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Load exam details
  useEffect(() => {
    if (id) {
      const exam = examsData.find(
        (exam) => exam.id === Number(id)
      );

      if (exam) {
        setExamDetails(exam);

        // Shuffle questions
        const shuffled = shuffleArray(exam.questions);
        setShuffledQuestions(shuffled);

        // Initialize responses object
        const initialResponses = {};
        shuffled.forEach((question) => {
          initialResponses[question.id] = "";
        });
        setResponses(initialResponses);

        // Parse duration
        let minutes = 0;
        if (exam.durationHours) {
          minutes += exam.durationHours * 60;
        }
        if (exam.durationMinutes) {
          minutes += exam.durationMinutes;
        }

        setTimeRemaining(minutes * 60); // Convert to seconds

        // Check if exam is within valid time boundaries
        const now = new Date();
        const examDate = new Date(exam.dueDate);

        // Check if exam date is valid
        if (examDate.toDateString() !== now.toDateString()) {
          setExamStatus("time-error");
          return;
        }

        // Check if current date matches exam's due date and time is within exam time boundaries
        if (exam.dueDate && exam.startTime && exam.endTime) {
          const examDate = new Date(exam.dueDate);
          const currentDate = new Date();
          
          // Check if the current date matches the exam date
          const isSameDate = 
            currentDate.getFullYear() === examDate.getFullYear() && 
            currentDate.getMonth() === examDate.getMonth() && 
            currentDate.getDate() === examDate.getDate();
            
          // Only check time if it's the right date
          if (!isSameDate) {
            console.log("Exam date doesn't match current date", {
              examDate: exam.dueDate,
              currentDate: currentDate.toISOString().split('T')[0]
            });
            setExamStatus("time-error");
            return;
          }
          
          // Check time on the correct date
          const [startHour, startMinute] = exam.startTime.split(':').map(Number);
          const [endHour, endMinute] = exam.endTime.split(':').map(Number);

          const startTimeMinutes = startHour * 60 + startMinute;
          const endTimeMinutes = endHour * 60 + endMinute;
          const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

          console.log("Checking time boundaries", {
            startTime: `${startHour}:${startMinute}`,
            endTime: `${endHour}:${endMinute}`,
            currentTime: `${now.getHours()}:${now.getMinutes()}`,
            withinBounds: !(currentTimeMinutes < startTimeMinutes || currentTimeMinutes > endTimeMinutes)
          });

          if (currentTimeMinutes < startTimeMinutes || currentTimeMinutes > endTimeMinutes) {
            setExamStatus("time-error");
            return;
          }
        }

        setExamStatus("not-started");
      } else {
        // Exam not found
        navigate('/user/s/exams');
      }
    }
  }, [id, navigate]);

  // Timer effect
  useEffect(() => {
    if (examStatus !== "in-progress" || !timeRemaining) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStatus, timeRemaining]);

  // Auto-save effect
  useEffect(() => {
    if (examStatus !== "in-progress") return;

    const interval = setInterval(() => {
      // In a real app, this would save to backend
      console.log("Auto-saving responses:", responses);
      setSaveMessage("Auto-saved");
      setTimeout(() => setSaveMessage(""), 2000);
    }, 30000); // Auto-save every 30 seconds

    setAutoSaveInterval(interval);

    return () => clearInterval(interval);
  }, [examStatus, responses]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [autoSaveInterval]);

  // Start the exam
  const handleStartExam = () => {
    setExamStatus("in-progress");
  };

  // Handle response change
  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle manual save
  const handleSaveResponse = () => {
    // In a real app, this would save to backend
    console.log("Manually saving response:", responses);
    setSaveMessage("Saved");
    setTimeout(() => setSaveMessage(""), 2000);
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
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

  // Prevent copy/paste in textarea
  const handleCopyPaste = (e) => {
    e.preventDefault();
    alert("Copy and paste is not allowed during the exam");
  };

  // If still loading
  if (examStatus === "loading") {
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

  // If exam time boundaries are invalid
  if (examStatus === "time-error") {
    return (
      <DashboardLayout
        title="Exam Not Available"
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col items-center justify-center h-64">
            <FiAlertTriangle className="text-5xl text-yellow-500 mb-4" />
            <div className="text-xl font-bold text-slate-800 mb-2">Exam Not Available</div>
            <div className="text-slate-600 text-center max-w-md">
              This exam is not available at this time. Please check the exam schedule and try again during the scheduled time.
            </div>
            <button
              onClick={() => navigate('/user/s/exams')}
              className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Back to Exams
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // If exam hasn't started yet, show start screen
  if (examStatus === "not-started") {
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
              <li>Questions have been randomized for this session.</li>
              <li>Once you start, the timer cannot be paused.</li>
              <li>Your answers are automatically saved every 30 seconds.</li>
              <li>Copying and pasting is not allowed during the exam.</li>
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

  // If exam is in progress
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <DashboardLayout
      title={examDetails.title}
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="sticky top-0 z-10 bg-white shadow-md border-b border-slate-200 p-4 mb-6 flex justify-between items-center">
        <div className="text-slate-800">
          Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
        </div>
        <div className="flex items-center">
          <div className={`font-mono text-lg font-bold ${
            timeRemaining < 300 ? "text-red-600 animate-pulse" : "text-slate-800"
          }`}>
            <FiClock className="inline mr-1" /> {formatTimeRemaining()}
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-slate-800 mb-4">
              {currentQuestion?.questionText}
            </h2>

            <div className="mb-6">
              <textarea
                ref={textareaRef}
                value={responses[currentQuestion?.id] || ""}
                onChange={(e) => handleResponseChange(currentQuestion?.id, e.target.value)}
                onCopy={handleCopyPaste}
                onPaste={handleCopyPaste}
                onCut={handleCopyPaste}
                placeholder="Type your answer here..."
                className="w-full border border-slate-300 rounded-md p-3 min-h-[200px] text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === shuffledQuestions.length - 1}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              <div className="flex items-center">
                {saveMessage && (
                  <span className="text-green-600 mr-3">
                    <FiSave className="inline mr-1" /> {saveMessage}
                  </span>
                )}
                <button
                  onClick={handleSaveResponse}
                  className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-24">
            <h3 className="text-lg font-medium text-slate-800 mb-3">Question Navigation</h3>
            <div className="grid grid-cols-4 gap-2">
              {shuffledQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`h-10 w-10 rounded-md flex items-center justify-center ${
                    index === currentQuestionIndex
                      ? "bg-primary text-white"
                      : responses[shuffledQuestions[index]?.id]
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-primary rounded-sm mr-2"></div>
                  <span className="text-sm text-slate-600">Current</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-green-50 border border-green-200 rounded-sm mr-2"></div>
                  <span className="text-sm text-slate-600">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-gray-50 rounded-sm mr-2"></div>
                  <span className="text-sm text-slate-600">Unanswered</span>
                </div>
              </div>

              <button
                onClick={handleSubmitExam}
                className="w-full mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Exam"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TakeExamPage;