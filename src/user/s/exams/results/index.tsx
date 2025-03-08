import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import { FiCheckCircle, FiXCircle, FiFileText, FiCalendar, FiClock } from "react-icons/fi";
import examsData from "../../../l/exams/data/exams.json";

function ExamResultsPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Fetch results logic would go here
    // This is a placeholder that simulates loading results

    // Mock data
    const mockResults = {
      score: 85,
      maxScore: 100,
      passingScore: 70,
      correctAnswers: 17,
      totalQuestions: 20,
      timeSpent: "45 minutes",
      submittedAt: new Date().toISOString(),
      feedback: "Good work overall. You demonstrated a strong understanding of the core concepts.",
      questions: [
        {
          question: "What is the capital of France?",
          yourAnswer: "Paris",
          isCorrect: true
        },
        {
          question: "Who wrote Romeo and Juliet?",
          yourAnswer: "Charles Dickens",
          isCorrect: false
        }
      ]
    };

    setResults(mockResults);
  }, [examId]);

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!results) {
    return (
      <DashboardLayout
        title="Results Not Found"
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col items-center justify-center h-64">
            <FiXCircle className="text-5xl text-red-500 mb-4" />
            <div className="text-xl font-bold text-slate-800 mb-2">Results Not Found</div>
            <div className="text-slate-600 text-center max-w-md">
              We couldn't find the results for this exam. If you've just completed the exam, please wait a few moments and try refreshing the page.
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

  const isPassed = results.score >= results.passingScore;

  return (
    <DashboardLayout
      title="Exam Results"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="card bg-gray-50 p-4 text-center hover:shadow-md transition-all">
            <div className="text-sm font-medium text-gray-500 mb-1">Score</div>
            <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(results.score, results.maxScore)}`}>
              {results.score}/{results.maxScore}
            </div>
          </div>

          <div className="card bg-gray-50 p-4 text-center hover:shadow-md transition-all">
            <div className="text-sm font-medium text-gray-500 mb-1">Date Taken</div>
            <div className="text-base sm:text-lg font-medium text-gray-700">
              {formatDate(results.submittedAt)}
            </div>
          </div>

          <div className="card bg-gray-50 p-4 text-center hover:shadow-md transition-all sm:col-span-2 md:col-span-1">
            <div className="text-sm font-medium text-gray-500 mb-1">Submitted At</div>
            <div className="text-base sm:text-lg font-medium text-gray-700">
              {new Date(results.submittedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>

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