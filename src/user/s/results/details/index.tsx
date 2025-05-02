import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import DashboardLayout from "../../layout";
import { formatExamTime } from "../../../../utils/exam";
import { getExamById, getExamSubmission } from "../../../../data/exams/service";
import { useAuth } from "../../../../data/auth/context";

interface RubricScore {
  name: string;
  value: number;
  description: string;
  score: number;
}

interface Question {
  id: string;
  type: "essay" | "multi-choice" | "fill-ins";
  questionText: string;
  yourAnswer: string;
  correctAnswer: string;
  points: number;
  score: number;
  isCorrect?: boolean;
  feedback?: string;
  rubricScores?: RubricScore[];
}

interface ExamResult {
  id: string;
  title: string;
  type: "exam" | "assignment" | "test";
  startTime: string;
  endTime: string;
  dueDate: Date;
  totalPoints: number;
  score: number;
  questions: Question[];
}

function StudentResultDetails() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadResults = async () => {
      try {
        if (!isAuthenticated || !user) {
          navigate('/login');
          return;
        }

        if (user.role !== 'student') {
          navigate('/user/l/dashboard');
          return;
        }

        const studentId = user.id;
        const examIdNumber = parseInt(examId || "", 10);
        console.log("Loading results for exam:", examIdNumber, "student:", studentId);

        const exam = await getExamById(examIdNumber);
        console.log("Exam data:", exam);
        const submission = await getExamSubmission(examIdNumber, studentId);
        console.log("Submission data:", submission);

        if (!exam || !submission) {
          console.log("Missing data:", { exam, submission });
          setExamResult(null);
          setLoading(false);
          return;
        }

        // Combine exam and submission data
        const examResultData: ExamResult = {
          id: exam.id.toString(),
          title: exam.title,
          type: exam.type,
          startTime: exam.startTime,
          endTime: exam.endTime,
          dueDate: new Date(exam.dueDate),
          totalPoints: exam.questions.reduce((sum, q) => sum + q.points, 0),
          score: submission.totalScore || 0,
          questions: exam.questions.map(question => {
            const questionSubmission = submission.answers.find(a => a.questionId === question.id);
            return {
              id: question.id,
              type: question.type,
              questionText: question.questionText,
              yourAnswer: questionSubmission?.answer || "",
              correctAnswer: question.questionAnswer || "",
              points: question.points,
              score: questionSubmission?.score || 0,
              isCorrect: questionSubmission?.isCorrect,
              feedback: questionSubmission?.feedback || "",
              rubricScores: []
            };
          })
        };

        setExamResult(examResultData);
      } catch (error) {
        console.error("Failed to load results:", error);
        setExamResult(null);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [examId, isAuthenticated, navigate, user]);

  const goBack = () => {
    navigate("/user/s/results");
  };

  const renderStudentAnswer = (question: Question) => {
    if (question.type === "essay") {
      return (
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">
            Your Answer:
          </p>
          <div className="bg-white p-3 rounded-md border border-slate-200 mb-3">
            <p className="text-slate-700">{question.yourAnswer}</p>
          </div>

          {question.rubricScores && (
            <div className="mb-3">
              <p className="text-sm font-medium text-slate-600 mb-2">
                Rubric Scores:
              </p>
              <div className="space-y-2">
                {question.rubricScores.map((score, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{score.name}</p>
                      <p className="text-xs text-slate-500">{score.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-700">{score.score}</span>
                      <span className="text-sm text-slate-500">/ {score.value}</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-slate-100 p-2 rounded mt-2">
                  <span className="text-sm font-medium text-slate-700">Total Score</span>
                  <span className="text-sm font-medium text-slate-700">
                    {question.score} / {question.points}
                  </span>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm font-medium text-slate-600 mb-1">Feedback:</p>
          <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
            <p className="text-slate-700">{question.feedback}</p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <p className="text-sm font-medium text-slate-600 mb-1">Your Answer:</p>
        <div className="bg-white p-3 rounded-md border border-slate-200">
          <p className="text-slate-700">{question.yourAnswer}</p>
        </div>
        <div className="mt-2">
          <p className="text-sm font-medium text-slate-600">Correct Answer:</p>
          <div className="bg-green-50 p-3 rounded-md border border-green-200">
            <p className="text-slate-700">{question.correctAnswer}</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading Results...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!examResult || examResult.questions.length === 0) {
    return (
      <DashboardLayout title="Results Not Found">
        <div className="text-center py-8">
          <p className="text-gray-500">The exam results you're looking for don't exist.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Exam Results Details" buttonTitle="">
      <div className="mb-4">
        <button
          onClick={goBack}
          className="inline-flex items-center text-primary hover:underline"
        >
          <FiArrowLeft className="mr-1" /> Back to Results
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {examResult.title}
          </h1>
          <p className="text-slate-600 mb-6">
            {examResult.type === "exam" ? "Exam" : "Assignment"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-sm text-slate-500 mb-1">Score</h3>
              <p
                className={`text-3xl font-bold ${examResult.score >= 60 ? "text-blue-600" : "text-red-600"}`}
              >
                {Math.round((examResult.score / examResult.totalPoints) * 100)}%
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-sm text-slate-500 mb-1">Time Taken</h3>
              <p className="text-xl font-semibold text-slate-800 flex items-center">
                <FiClock className="mr-2 text-slate-400" />
                {formatExamTime(examResult.startTime + " - " + examResult.endTime)}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-sm text-slate-500 mb-1">Date Taken</h3>
              <p className="text-xl font-semibold text-slate-800 flex items-center">
                <FiCalendar className="mr-2 text-slate-400" />
                {examResult.dueDate.toLocaleDateString()}
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Questions & Answers
          </h2>

          <div className="space-y-6">
            {examResult.questions.map((q, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border ${
                  q.isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`mr-3 mt-1 ${q.isCorrect ? "text-green-500" : "text-red-500"}`}
                  >
                    {q.isCorrect ? (
                      <FiCheckCircle size={20} />
                    ) : (
                      <FiXCircle size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 mb-2">
                      Question {index + 1}
                    </h3>
                    <p className="text-slate-700 mb-4">{q.questionText}</p>
                    {renderStudentAnswer(q)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentResultDetails;
