import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout"; // Updated import path
import examsData from "../../../l/exams/data/exams.json";
import { FiCheckCircle, FiXCircle, FiArrowLeft } from "react-icons/fi";

interface Exam {
  id: number;
  title: string;
  type: string;
  duration: string;
  dueDate: string;
  description: string;
  status: string;
  classId: number;
  className: string;
  questions: {
    id: string;
    type: string;
    questionText: string;
    options?: string[];
    questionAnswer: string;
  }[];
}

interface ResultQuestion {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  feedback?: string;
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
  examTitle: string;
  examClass: string;
}

function StudentResultDetails() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Find the exam in the data
    const typedExamsData = examsData as Exam[];
    const exam = typedExamsData.find((e) => e.id === Number(examId));

    if (exam) {
      // Generate mock results for the exam
      const mockQuestions = exam.questions.map((q) => {
        const isCorrect = Math.random() > 0.3;
        const yourAnswer = isCorrect
          ? q.questionAnswer
          : q.options
            ? q.options[Math.floor(Math.random() * q.options.length)]
            : "Student's answer that wasn't correct";

        return {
          question: q.questionText,
          yourAnswer,
          correctAnswer: q.questionAnswer,
          isCorrect,
          feedback: isCorrect
            ? "Good job! Your answer is correct."
            : "Your answer is incorrect. Review the material on this topic.",
        };
      });

      const correctCount = mockQuestions.filter((q) => q.isCorrect).length;
      const totalQuestions = mockQuestions.length;
      const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

      const mockResults: ExamResult = {
        score: scorePercentage,
        maxScore: 100,
        passingScore: 70,
        correctAnswers: correctCount,
        totalQuestions,
        timeSpent: `${Math.floor(Math.random() * 60)} minutes`,
        submittedAt: new Date().toISOString(),
        feedback:
          scorePercentage >= 80
            ? "Excellent work! You've demonstrated a strong understanding of the material."
            : scorePercentage >= 70
              ? "Good job. You've passed the exam but there's room for improvement."
              : "You need to review the material. Consider scheduling a meeting with your instructor.",
        questions: mockQuestions,
        examTitle: exam.title,
        examClass: exam.className,
      };

      setResults(mockResults);
    }

    setLoading(false);
  }, [examId]);

  const renderStudentAnswer = (question: ResultQuestion) => {
    return (
      <div className="mt-2">
        <div className="font-medium text-slate-700">Your Answer:</div>
        <div className="p-3 bg-gray-50 rounded mt-1 text-slate-700">
          {question.yourAnswer}
        </div>

        <div className="font-medium text-slate-700 mt-3">Correct Answer:</div>
        <div className="p-3 bg-gray-50 rounded mt-1 text-slate-700">
          {question.correctAnswer}
        </div>

        {question.feedback && (
          <>
            <div className="font-medium text-slate-700 mt-3">Feedback:</div>
            <div className="p-3 bg-blue-50 border-l-4 border-blue-300 rounded mt-1 text-slate-700">
              {question.feedback}
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading || !results) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const isPassed = results.score >= results.passingScore;
  const getScoreBadge = (score: number): { text: string; color: string } => {
    if (score >= 90)
      return { text: "Excellent", color: "bg-green-100 text-green-800" };
    if (score >= 80)
      return { text: "Good", color: "bg-blue-100 text-blue-800" };
    if (score >= 70)
      return { text: "Satisfactory", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Failed", color: "bg-red-100 text-red-800" };
  };

  const scoreBadge = getScoreBadge(results.score);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <button
          onClick={() => navigate("/user/s/results")}
          className="flex items-center text-primary hover:text-primary/80 mb-4"
        >
          <FiArrowLeft className="mr-1" /> Back to Results
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {results.examTitle}
            </h1>
            <p className="text-slate-600">{results.examClass}</p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${scoreBadge.color}`}
          >
            {scoreBadge.text}
          </span>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${isPassed ? "bg-green-100" : "bg-red-100"}`}
          >
            {isPassed ? (
              <FiCheckCircle className="text-4xl text-green-500" />
            ) : (
              <FiXCircle className="text-4xl text-red-500" />
            )}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {isPassed ? "You Passed!" : "Try Again"}
            </h2>
            <p className="text-slate-600">
              Your score:{" "}
              <span className="font-semibold">{results.score}%</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
          <div>
            <p className="text-sm text-gray-500">Time Spent</p>
            <p className="font-medium text-gray-700">{results.timeSpent}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Submitted On</p>
            <p className="font-medium text-gray-700">
              {new Date(results.submittedAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Correct Answers</p>
            <p className="font-medium text-gray-700">
              {results.correctAnswers} of {results.totalQuestions}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-3">
            Instructor Feedback
          </h2>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
            <p className="text-gray-700">{results.feedback}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Question Breakdown
        </h2>

        <div className="space-y-6">
          {results.questions.map((q, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${q.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
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
                  <div className="font-medium text-slate-800">
                    Question {index + 1}
                  </div>
                  <div className="text-slate-700 mt-1">{q.question}</div>
                  {renderStudentAnswer(q)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/user/s/results")}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Back to Results
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentResultDetails;