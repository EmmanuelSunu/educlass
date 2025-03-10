import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import DashboardLayout from "../../layout";

// Define the type for the results
interface ResultQuestion {
  question: string;
  yourAnswer: string;
  isCorrect: boolean;
  correctAnswer?: string; // Added optional correctAnswer
}

interface ExamResult {
  examId: number;
  score: number;
  maxScore: number;
  status: string;
  submittedAt: string;
  examTitle: string;
  examClass: string;
  examType: string;
  timeTaken: string;
  dateTaken: string;
  feedback: string;
  questions: ResultQuestion[];
}

// Mock results for testing
const mockResults: ExamResult = {
  examId: 1,
  score: 85,
  maxScore: 100,
  status: "passed",
  submittedAt: "2023-12-01T10:30:00Z",
  examTitle: "Advanced Programming Concepts Test",
  examClass: "Introduction to Programming",
  examType: "Midterm",
  timeTaken: "45 min",
  dateTaken: "Dec 1, 2023",
  feedback: "Good job! You've demonstrated solid understanding of the concepts.",
  questions: [
    {
      question: "What is the time complexity of QuickSort in the average case?",
      yourAnswer: "O(n log n)",
      isCorrect: true
    },
    {
      question: "Explain the key principles of object-oriented programming.",
      yourAnswer: "Encapsulation, inheritance, polymorphism, and abstraction.",
      isCorrect: true
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
  ]
};

function StudentResultDetail() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, [examId]);

  const getScoreColorClass = (score: number): string => {
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

            <h1 className="text-2xl font-bold text-gray-800 mb-4">{results.examTitle}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Score</p>
                <p className={`text-xl font-bold ${getScoreColorClass(results.score)}`}>
                  {results.score}/{results.maxScore}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Time Taken</p>
                <p className="text-xl font-medium text-gray-700">
                  {results.timeTaken}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Date Taken</p>
                <p className="text-xl font-medium text-gray-700">
                  {results.dateTaken}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Feedback</h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-gray-700">{results.feedback}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Question Analysis</h2>

              {results.questions.map((q, index) => (
                <div key={index} className="mb-4 border border-gray-200 rounded-md p-4">
                  <div className="flex items-start mb-2">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-white ${q.isCorrect ? 'bg-green-500' : 'bg-red-500'} mr-2`}>
                      {q.isCorrect ? '✓' : '✗'}
                    </span>
                    <p className="text-gray-800 font-medium">{q.question}</p>
                  </div>
                  <div className="ml-8">
                    <p className="text-sm text-gray-500">Your Answer:</p>
                    <p className="text-gray-700">{q.yourAnswer}</p>
                    {!q.isCorrect && q.correctAnswer && (
                      <>
                        <p className="text-sm text-gray-500 mt-2">Correct Answer:</p>
                        <p className="text-green-700">{q.correctAnswer}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-center text-gray-500">No result found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentResultDetail;