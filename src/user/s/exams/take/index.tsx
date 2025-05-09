import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layout/index";
// import { FiClock } from "react-icons/fi";
import { type Exam, type Question } from "../../../../data/exams/types";
import { getExamById } from "../../../../data/exams/service";
import { getExamStatus } from "../../../../utils/examStatus";
import { updateSubmission } from "../../../../data/exams/submissions";
import { isExamAvailable } from "../../../../utils/exam";
import { useAuth } from "../../../../data/auth/context";

/*
  Exam Take UI Security Enhancements
  ----------------------------------
  1. Preventing Pasting into Input Fields:
     - All answer fields (textarea, input, radio) have an onPaste event handler that calls e.preventDefault().
     - This blocks any attempt to paste content into these fields, ensuring answers must be typed manually.

  2. Preventing Copying of Question Text:
     - The question text <p> element has an onCopy event handler that calls e.preventDefault().
     - The select-none class is also applied to make the text unselectable.
     - This blocks any attempt to copy the question text, protecting exam content.
*/

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

const ExamTake: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const examId = id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }

    if (examId) {
      console.log('Fetching exam with ID:', examId);
      const examData = getExamById(Number(examId));
      console.log('Exam data:', examData);
      
      if (examData) {
        setExam(examData);
        
        // Check if exam is available
        const isAvailable = isExamAvailable(new Date(examData.dueDate), examData.startTime, examData.endTime);
        console.log('Exam availability check:', isAvailable);
        
        if (!isAvailable) {
          console.log('Exam not available, redirecting to exams page');
          navigate("/user/s/exams");
          return;
        }

        // Initialize timer to exam duration (in seconds)
        const durationSeconds = (examData.durationHours * 3600) + (examData.durationMinutes * 60);
        setTimeLeft(durationSeconds);
        setLoading(false);
      } else {
        console.log('Exam not found');
        setLoading(false);
      }
    } else {
      console.log('No exam ID provided');
      setLoading(false);
    }
  }, [examId, navigate, user]);

  useEffect(() => {
    if (!exam) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!isSubmitting) handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Update every second

    return () => {
      clearInterval(timer);
    };
  }, [exam, isSubmitting]);

  const handleSubmit = async () => {
    if (!exam || !user || isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Create submission object
      const submission = {
        id: Date.now(),
        studentId: user.id,
        studentName: user.name,
        examId: exam.id,
        submittedAt: new Date().toISOString(),
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
          score: 0,
          feedback: ""
        })),
        totalScore: 0,
        status: "pending" as const
      };
      // Update submission
      updateSubmission(submission);
      setShowSubmitModal(true);
      setTimeout(() => {
        setShowSubmitModal(false);
        setIsSubmitting(false);
        navigate("/user/s/exams");
      }, 2000);
    } catch (error) {
      console.error("Failed to submit exam:", error);
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Add console log for exam state changes
  useEffect(() => {
    console.log('Exam state updated:', exam);
  }, [exam]);

  if (loading) {
    console.log('Rendering loading state');
    return (
      <DashboardLayout title="Loading Exam...">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!exam) {
    console.log('Rendering exam not found state');
    return (
      <DashboardLayout title="Exam Not Found">
        <div className="text-center py-8">
          <p className="text-gray-500">The exam you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/user/s/exams')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Exams
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Check exam availability
  const status = getExamStatus(exam);
  if (status !== "available") {
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
  }

  const renderQuestionDisplay = (question: Question) => {
    switch (question.type) {
      case "multi-choice":
        return (
          <div className="space-y-3">
            {question.options?.map((option: string, index: number) => (
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
                  onPaste={e => e.preventDefault()}
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
            onPaste={e => e.preventDefault()}
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
            onPaste={e => e.preventDefault()}
          />
        );

      default:
        return <p className="text-red-500">Unsupported question type</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow z-20">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          {/* Exit Exam Button - Modified for mobile */}
          <button
            onClick={() => navigate('/user/s/exams')}
            className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium transition-colors group order-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Exit Exam</span> {/* Text hidden on xs screens */}
          </button>

          {/* Exam Title and Course - Centered and responsive */}
          <div className="flex flex-col items-center text-center order-3 sm:order-2 w-full sm:w-auto mt-2 sm:mt-0 flex-grow">
            <span className="text-base sm:text-lg font-bold text-slate-900">{exam.title}</span>
            <span className="text-xs text-slate-500 font-medium">{exam.className}</span>
          </div>

          {/* Timer - Modified for mobile */}
          <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-mono text-sm sm:text-lg font-semibold transition-all duration-300 order-2 sm:order-3
            ${timeLeft <= 60 ? 'bg-red-100 text-red-600 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-slate-100 text-slate-700 shadow'}
          `}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-32">
        <div className="space-y-10">
          {exam.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-2xl border border-slate-100 transition-shadow duration-200 hover:shadow-lg p-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-base shadow-sm">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-semibold text-slate-800">Question {index + 1}</h3>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                  {question.points} points
                </span>
              </div>
              <p
                className="text-slate-700 mb-6 text-base font-medium select-none"
                onCopy={e => e.preventDefault()}
              >
                {question.questionText}
              </p>
              <div className="mt-2">
                {renderQuestionDisplay(question)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{Object.keys(answers).length}</span> of <span className="font-semibold text-slate-900">{exam.questions.length}</span> questions answered
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-10 rounded-xl shadow-md transition-all duration-150 ease-in-out flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <span>Submit Exam</span>
            )}
          </button>
        </div>
      </div>

      {/* Modal for exam submission */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center animate-fade-in">
            <svg className="mx-auto mb-4 w-16 h-16 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0a9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2 text-green-700">Exam Submitted!</h2>
            <p className="text-slate-700 mb-6">Your exam has been successfully submitted. Good luck!</p>
            <p className="text-slate-500 text-sm">Redirecting to exams...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTake;