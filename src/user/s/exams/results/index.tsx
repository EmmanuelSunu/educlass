import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import examsData from "../../../l/exams/data/exams.json";
import { FaClipboardList } from "react-icons/fa";

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

interface Question {
  id: string;
  type: string;
  questionText: string;
  options?: string[];
  questionAnswer: string;
}

interface ResultQuestion {
  question: string;
  yourAnswer: string;
  isCorrect: boolean;
}

interface ExamResult {
  score: number;
  maxScore: number;
  passingScore: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: string;
  submittedAt: string;
  feedback: string;
  questions: ResultQuestion[];
  examTitle?: string;
  examClass?: string;
}

function ExamResultsPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<ExamResult | null>(null);
  const [examDetails, setExamDetails] = useState<Exam | null>(null);
  const [participated, setParticipated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const typedExamsData = examsData as Exam[];
    const exam = typedExamsData.find(e => e.id === Number(examId));

    if (exam) {
      setExamDetails(exam);
      const now = new Date();
      const examDate = new Date(exam.dueDate);
      const isPastExam = examDate < now;
      const mockParticipated = isPastExam && (Math.random() > 0.3);
      setParticipated(mockParticipated);

      if (mockParticipated) {
        const mockQuestions = exam.questions.map((q) => {
          const isCorrect = Math.random() > 0.3;
          const yourAnswer = isCorrect
            ? q.options?.[0] ?? "No answer"
            : q.options?.[Math.floor(Math.random() * (q.options.length - 1)) + 1] ?? "No answer";

          return {
            question: q.questionText,
            yourAnswer,
            isCorrect
          };
        });

        const correctCount = mockQuestions.filter(q => q.isCorrect).length;
        const totalQuestions = mockQuestions.length;
        const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

        const mockResults: ExamResult = {
          score: scorePercentage,
          maxScore: 100,
          passingScore: 70,
          correctAnswers: correctCount,
          totalQuestions,
          timeSpent: `${Math.floor(Math.random() * exam.durationMinutes)} minutes`,
          submittedAt: new Date().toISOString(),
          feedback: "Good work overall. You demonstrated a strong understanding of the core concepts.",
          questions: mockQuestions,
          examTitle: exam.title,
          examClass: exam.className
        };

        setResults(mockResults);
      } else {
        setResults(null);
      }
    }
    setLoading(false);
  }, [examId]);

  const getScoreColor = (score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Loading Results..."
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (participated === false) {
    return (
      <DashboardLayout
        title="Exam Results"
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 my-6">
          <h2 className="text-h3 font-bold text-gray-800">{examDetails?.title}</h2>
          <p className="text-p text-gray-600 mt-1">{examDetails?.className}</p>

          <div className="mt-6 p-6 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center">
              <FaClipboardList className="text-amber-500 w-8 h-8 mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-red-700">Did Not Participate</h3>
                <p className="text-red-600 mt-1">You did not submit this exam before the deadline.</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate('/user/s/exams')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Return to Exams
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!results) {
    return (
      <DashboardLayout
        title="Exam Results"
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const isPassed = results.score >= results.passingScore;

  return (
    <DashboardLayout
      title={`${examDetails?.title || 'Exam'} Results`}
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isPassed ? 'bg-green-100' : 'bg-red-100'}`}>
            {isPassed ? (
              <FiCheckCircle className="text-4xl text-green-500" />
            ) : (
              <FiXCircle className="text-4xl text-red-500" />
            )}
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-slate-800">
              {isPassed ? "You Passed!" : "Try Again"}
            </h1>
            <p className="text-slate-600">
              Your score: <span className="font-semibold">{results.score}%</span>
              {isPassed ? (
                <span className="text-green-500 ml-2">
                  (Passing score: {results.passingScore}%)
                </span>
              ) : (
                <span className="text-red-500 ml-2">
                  (Passing score: {results.passingScore}%)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6"> {/* Added lg:grid-cols-3 */}
          <div className="bg-gray-50 p-4 rounded-md text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Score</div>
            <div className={`text-2xl font-bold ${getScoreColor(results.score, results.maxScore)}`}>
              {results.score}/{results.maxScore}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Date Taken</div>
            <div className="text-lg font-medium text-gray-700">
              {formatDate(results.submittedAt)}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Time Spent</div>
            <div className="text-lg font-medium text-gray-700">
              {results.timeSpent}
            </div>
          </div>
        </div>

        {examDetails && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Exam Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium text-gray-700">{examDetails.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium text-gray-700">{examDetails.className}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Instructor Feedback</h2>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
            <p className="text-gray-700">{results.feedback}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-slate-800 mb-4">Question Breakdown</h2>

        <div className="space-y-6">
          {results.questions.map((q, index) => (
            <div key={index} className={`p-4 rounded-lg border ${q.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-start">
                <div className={`mr-3 mt-1 ${q.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {q.isCorrect ? <FiCheckCircle size={20} /> : <FiXCircle size={20} />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-800">Question {index + 1}</div>
                  <div className="text-slate-700 mt-1">{q.question}</div>

                  <div className="mt-3">
                    <div className="text-sm text-slate-500">Your answer:</div>
                    <div className="text-slate-700 mt-1">{q.yourAnswer}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate('/user/s/exams')}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Back to Exams
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ExamResultsPage;