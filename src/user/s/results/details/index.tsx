import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layout";
import { FiArrowLeft, FiCheckCircle, FiXCircle } from "react-icons/fi";

// Mock data
const mockResults = {
  id: 301,
  examId: 301,
  examTitle: "Advanced Programming Concepts Test",
  examClass: "Introduction to Programming",
  examType: "Quiz",
  score: 83,
  timeTaken: "31 minutes",
  dateTaken: "07/03/2025",
  feedback: "Very Good",
  questions: [
    {
      question: "Explain the key principles of object-oriented programming and provide examples of how they are applied in software development.",
      yourAnswer: "A comprehensive explanation of encapsulation, inheritance, polymorphism, and abstraction with relevant examples.",
      isCorrect: true,
    },
    {
      question: "What is the time complexity of QuickSort in the average case?",
      yourAnswer: "O(n log n)",
      correctAnswer: "O(n log n)",
      isCorrect: true,
    },
    {
      question: "Which data structure uses LIFO (Last In First Out) principle?",
      yourAnswer: "Stack",
      correctAnswer: "Stack",
      isCorrect: true,
    },
    {
      question: "What is the purpose of a constructor in OOP?",
      yourAnswer: "To create objects",
      correctAnswer: "To initialize object attributes when an instance is created",
      isCorrect: false,
    },
    {
      question: "Which sorting algorithm has the best average-case performance?",
      yourAnswer: "Bubble Sort",
      correctAnswer: "Quick Sort or Merge Sort",
      isCorrect: false,
    },
  ],
};

function StudentResultDetail() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, [examId]);

  const getScoreColorClass = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout title="Result Details">
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : results ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <button
                onClick={() => navigate("/user/s/results")}
                className="flex items-center text-primary hover:text-primary/80"
              >
                <FiArrowLeft className="mr-1" /> Back to Results
              </button>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {results.examTitle}
              </h1>
              <p className="text-gray-600">
                {results.examClass} • {results.examType}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Score</p>
                  <p
                    className={`text-2xl font-bold ${getScoreColorClass(results.score)}`}
                  >
                    {results.score}%
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Overall Feedback</p>
                  <p className="text-lg font-medium text-gray-700">
                    {results.feedback}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Time Taken</p>
                  <p className="text-lg font-medium text-gray-700">
                    {results.timeTaken}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Date Taken</p>
                  <p className="text-lg font-medium text-gray-700">
                    {results.dateTaken}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Questions & Answers
              </h2>
              <div className="space-y-6">
                {results.questions.map((q, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      q.isCorrect
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`mr-3 mt-1 ${
                          q.isCorrect ? "text-green-500" : "text-red-500"
                        }`}
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

                        <div className="mt-3">
                          <div className="text-sm text-gray-500">
                            Your Answer:
                          </div>
                          <div
                            className={`mt-1 ${
                              q.isCorrect
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {q.yourAnswer}
                          </div>

                          {!q.isCorrect && q.correctAnswer && (
                            <>
                              <div className="text-sm text-gray-500 mt-2">
                                Correct Answer:
                              </div>
                              <div className="mt-1 text-green-700">
                                {q.correctAnswer}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-center text-gray-500">Result not found</p>
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/user/s/results")}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Back to Results
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentResultDetail;