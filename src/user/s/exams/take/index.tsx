import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/index";
import { FiClock } from "react-icons/fi";
import { type Question, type Exam } from "../../../../data/exams/types";
import { getExamById } from "../../../../data/exams/service";
import { getExamStatus } from "../../../../utils/examStatus";
import { 
  calculateRemainingTime, 
  isExamAvailable, 
  compareAnswers,
  formatExamTime 
} from "../../../../utils/exam";

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function TakeExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (id) {
      const examData = getExamById(Number(id));
      if (examData) {
        setExam(examData);
        
        // Check if exam is available
        if (!isExamAvailable(new Date(examData.dueDate), examData.startTime, examData.endTime)) {
          navigate("/user/s/exams");
          return;
        }

        // Initialize remaining time
        const remaining = calculateRemainingTime(new Date(examData.dueDate), examData.endTime);
        setRemainingTime(remaining);
      }
    }
    setLoading(false);
  }, [id, navigate]);

  useEffect(() => {
    if (!exam || submitted) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [exam, submitted]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!exam) return;

    // Process answers
    const processedAnswers = exam.questions.map((question) => {
      const userAnswer = answers[question.id] || "";
      let isCorrect = false;

      switch (question.type) {
        case "multi-choice":
          isCorrect = userAnswer === question.questionAnswer;
          break;
        case "fill-ins":
          isCorrect = compareAnswers(userAnswer, question.questionAnswer);
          break;
        case "essay":
          // Essay answers need manual grading
          isCorrect = false;
          break;
      }

      return {
        questionId: question.id,
        userAnswer,
        isCorrect,
      };
    });

    setSubmitted(true);
    // Here you would typically send the answers to your backend
    navigate("/user/s/results");
  };

  const handleTimeUp = async () => {
    setShowTimeUpModal(true);
    // Auto submit after 3 seconds
    setTimeout(() => {
      handleSubmit();
    }, 3000);
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!exam) {
    return (
      <DashboardLayout title="Exam Not Found">
        <div className="text-center py-8">
          <p className="text-gray-500">The exam you're looking for doesn't exist.</p>
        </div>
      </DashboardLayout>
    );
  }

  // Check exam availability
  const status = getExamStatus(exam, true);
  if (status !== "available")
    return (
      <DashboardLayout
        title="Exam Not Available"
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md text-center">
            <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-xl font-semibold text-yellow-700 mb-2">Exam Not Available</h2>
            <p className="text-gray-600 mb-4">
              {status === "past" ? "This exam has ended." : "This exam is not yet available."}
            </p>
            <button 
              onClick={() => navigate('/user/s/exams')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Exams
            </button>
          </div>
        </div>
      </DashboardLayout>
    );

  const renderQuestionDisplay = (question: Question) => {
    switch (question.type) {
      case "multi-choice":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center space-x-3 p-3.5 rounded-lg border-2 transition-all cursor-pointer ${
                  answers[question.id] === option
                    ? 'border-primary/30 bg-primary/5 shadow-sm'
                    : 'border-slate-200 hover:border-primary/20 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary/20"
                />
                <span className={`text-slate-700 ${answers[question.id] === option ? 'font-medium' : ''}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case "essay":
        return (
          <textarea
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full min-h-[120px] p-4 bg-white border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-colors"
            placeholder="Type your answer here..."
          />
        );

      case "fill-ins":
        return (
          <input
            type="text"
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Type your answer here..."
          />
        );

      default:
        return <p className="text-red-500">Unsupported question type</p>;
    }
  };

  // Full screen exam mode
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Time Up Modal */}
      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="text-3xl text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Time's Up!</h3>
              <p className="text-slate-600 mb-4">
                Your exam time has expired. Your answers will be automatically submitted in a few seconds.
              </p>
              <div className="animate-pulse">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Exam Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Left side - Title and Back Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/user/s/exams')}
                className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Exit Exam</span>
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">{exam.title}</h1>
                <p className="text-sm text-slate-600">{exam.className}</p>
              </div>
            </div>

            {/* Right side - Timer */}
            <div className={`px-4 py-2 rounded-lg font-mono text-lg font-medium ${
              remainingTime && remainingTime <= 300 
                ? 'bg-red-50 text-red-600 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                : 'bg-slate-50 text-slate-700 shadow-[0_0_10px_rgba(100,116,139,0.1)]'
            }`}>
              {remainingTime !== null ? formatTime(remainingTime) : '--:--:--'}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20 max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {exam?.questions.map((question, index) => (
            <div key={question.id ?? index} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-semibold">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-medium text-slate-900">Question {index + 1}</h3>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
                  {question.points} points
                </span>
              </div>
              <div className="exam-question prose prose-slate max-w-none mb-6 select-none" 
                onCopy={(e) => e.preventDefault()} 
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
              >
                {question.questionText}
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                {renderQuestionDisplay(question)}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Section - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{Object.keys(answers).length}</span> of <span className="font-semibold text-slate-900">{exam?.questions.length}</span> questions answered
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-8 rounded-lg shadow-sm transition duration-150 ease-in-out flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitted ? (
                <>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Exam</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Extra padding at bottom to account for fixed submit section */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}

export default TakeExamPage;