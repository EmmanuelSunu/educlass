import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import { FiAlertTriangle } from "react-icons/fi";
import examsData from "../../../l/exams/data/exams.json";

interface Question {
  id: string;
  type: string;
  questionText: string;
  options?: string[];
  questionAnswer: string;
  points?: number; 
}

interface Exam {
  id: number;
  title: string;
  type: string;
  duration: string;
  durationHours: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  status: string;
  dueDate: string;
  description: string;
  classId: number;
  className: string;
  questions: Question[];
}

function TakeExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const typedExamsData = examsData as Exam[];
    const foundExam = typedExamsData.find(exam => exam.id === Number(id));

    if (foundExam) {
      const processedExam = {
        ...foundExam,
        questions: foundExam.questions.map((question, index) => ({
          ...question,
          id: question.id ?? `q${index + 1}`, 
          points: 5 
        }))
      };

      setExam(processedExam);
      const totalMinutes = (processedExam.durationHours * 60) + processedExam.durationMinutes;
      setTimeLeft(totalMinutes * 60); 
      setLoading(false);
    } else {
      console.error("Exam not found with ID:", id);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id]);


  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev && prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            handleSubmit();
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success popup instead of immediate navigation
      setShowSuccessPopup(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting exam:', error);
      setIsSubmitting(false);
    }
  };

  const handleViewResults = () => {
    navigate(`/user/s/results/${id}`);
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Taking Exam"
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!exam) {
    return (
      <DashboardLayout
        title="Exam Not Found"
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Exam Not Found</h2>
          <p className="text-gray-600 mb-6">The exam you're looking for could not be found.</p>
          <button
            onClick={() => navigate('/user/s/exams')}
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md"
          >
            Return to Exams
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const renderQuestionDisplay = (question: Question) => {
    switch (question.type) {
      case 'multi-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-start cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  className="mt-0.5 mr-3"
                  checked={answers[question.id] === option}
                  onChange={() => handleAnswerChange(question.id, option)}
                />
                <span className="text-base text-slate-800">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'fill-ins':
        return (
          <div>
            <input
              type="text"
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your answer"
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              onPaste={(e) => e.preventDefault()}
            />
          </div>
        );
      case 'essay':
        return (
          <div>
            <textarea
              className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[150px]"
              placeholder="Write your essay answer here..."
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              onPaste={(e) => e.preventDefault()}
              rows={6}
            />
          </div>
        );
      default:
        return <p className="text-red-500">Unsupported question type</p>;
    }
  };

  return (
    <DashboardLayout
      title={`Taking Exam: ${exam?.title}`}
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{exam?.title}</h1>
          <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-md flex items-center space-x-2">
            <span className="font-medium">Time Left:</span> 
            <span className="font-mono text-lg">{timeLeft !== null ? formatTime(timeLeft) : "00:00:00"}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Exam Instructions</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Answer all questions to the best of your ability.</li>
            <li>Your answers will be auto-saved as you progress.</li>
            <li>Once submitted, you cannot return to change your answers.</li>
            <li>The exam will auto-submit when the time expires.</li>
            {exam?.description && <li>{exam.description}</li>}
          </ul>
        </div>

        <div className="space-y-8">
          {exam?.questions.map((question, index) => (
            <div key={question.id ?? index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Question {index + 1}</h3>
                <span className="text-sm text-gray-500">{question.points ?? 5} points</span>
              </div>
              <p className="text-gray-700 mb-4">{question.questionText}</p> 
              {renderQuestionDisplay(question)}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{Object.keys(answers).length}</span> of {exam?.questions.length} questions answered
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Exam</span>
              </>
            )}
          </button>
        </div>

        {Object.keys(answers).length < exam?.questions.length && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center space-x-3 text-amber-700">
            <FiAlertTriangle className="flex-shrink-0" />
            <p className="text-sm">You have unanswered questions. Please review before submitting.</p>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Exam Submitted Successfully!</h2>
              <button
                onClick={handleViewResults}
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md"
              >
                View Results
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default TakeExamPage;