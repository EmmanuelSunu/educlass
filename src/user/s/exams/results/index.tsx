import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import examsData from "../../../l/exams/data/exams.json";

function ExamResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examResult, setExamResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch exam result data
    // This would typically be an API call
    // For now, we'll simulate loading
    setTimeout(() => {
      setLoading(false);
      // Mock data - in a real app, this would come from an API
      setExamResult({
        examId: id,
        title: "Sample Exam",
        score: 85,
        totalQuestions: 20,
        correctAnswers: 17,
        timeTaken: "45 minutes"
      });
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout
        title="Loading Results..."
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading exam results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!examResult) {
    return (
      <DashboardLayout
        title="Results Not Found"
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-xl font-bold text-slate-800 mb-2">Results Not Available</div>
            <div className="text-slate-600 text-center max-w-md">
              The exam results you're looking for could not be found.
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

  return (
    <DashboardLayout
      title="Exam Results"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">{examResult.title} Results</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-600">Score</p>
            <p className="text-3xl font-bold text-primary">{examResult.score}%</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-600">Questions</p>
            <p className="text-3xl font-bold text-slate-800">
              {examResult.correctAnswers} / {examResult.totalQuestions} correct
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg mb-6">
          <p className="text-slate-600">Time Taken</p>
          <p className="text-xl font-semibold text-slate-800">{examResult.timeTaken}</p>
        </div>

        <button
          onClick={() => navigate('/user/s/exams')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Back to Exams
        </button>
      </div>
    </DashboardLayout>
  );
}

export default ExamResultsPage;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

function ExamResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock loading the results data
    setTimeout(() => {
      // Mock results data
      const mockResults = {
        examId: Number(id),
        examTitle: "Midterm Exam: Introduction to Computer Science",
        totalQuestions: 10,
        correctAnswers: 8,
        score: 80,
        passingScore: 60,
        dateTaken: new Date().toISOString(),
        timeSpent: "45 minutes",
        questions: [
          {
            question: "What is the difference between a compiler and an interpreter?",
            yourAnswer: "A compiler translates the entire code before execution, while an interpreter executes the code line by line.",
            isCorrect: true,
            points: 10,
            feedback: "Excellent answer!"
          },
          {
            question: "Which of the following is NOT a primitive data type in JavaScript?",
            yourAnswer: "Array",
            correctAnswer: "Array",
            isCorrect: true,
            points: 10,
            feedback: ""
          },
          {
            question: "What does CSS stand for?",
            yourAnswer: "Cascading Style Sheet",
            correctAnswer: "Cascading Style Sheets",
            isCorrect: false,
            points: 0,
            feedback: "Close, but the correct term is 'Sheets' (plural)."
          }
        ]
      };
      
      setResults(mockResults);
      setLoading(false);
    }, 1500);
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout
        title="Loading Results..."
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading your exam results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{results.examTitle}</h1>
          
          <div className={`mt-6 p-4 rounded-full ${isPassed ? 'bg-green-100' : 'bg-red-100'}`}>
            {isPassed ? (
              <FiCheckCircle className={`text-5xl ${isPassed ? 'text-green-500' : 'text-red-500'}`} />
            ) : (
              <FiXCircle className={`text-5xl ${isPassed ? 'text-green-500' : 'text-red-500'}`} />
            )}
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-4xl font-bold mb-1">{results.score}%</div>
            <div className={`text-lg ${isPassed ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {isPassed ? 'Passed' : 'Failed'}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Passing score: {results.passingScore}%
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-slate-500">Total Questions</div>
            <div className="text-xl font-semibold text-slate-800">{results.totalQuestions}</div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-slate-500">Correct Answers</div>
            <div className="text-xl font-semibold text-slate-800">{results.correctAnswers}</div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-slate-500">Time Spent</div>
            <div className="text-xl font-semibold text-slate-800">{results.timeSpent}</div>
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
                  
                  {!q.isCorrect && q.correctAnswer && (
                    <div className="mt-3">
                      <div className="text-sm text-green-600">Correct answer:</div>
                      <div className="text-slate-700 mt-1">{q.correctAnswer}</div>
                    </div>
                  )}
                  
                  {q.feedback && (
                    <div className="mt-3 p-2 bg-white rounded border border-slate-200">
                      <div className="text-sm text-slate-500">Feedback:</div>
                      <div className="text-slate-700 mt-1">{q.feedback}</div>
                    </div>
                  )}
                  
                  <div className="mt-2 text-right">
                    <span className="text-sm font-medium">
                      {q.points} / {q.isCorrect ? q.points : q.points} points
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
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

export default ExamResults;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import examsData from "../../../l/exams/data/exams.json";
import { FiCheckCircle, FiFileText, FiCalendar, FiClock } from "react-icons/fi";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

// Mock data for exam results
const mockResults = {
  score: 85,
  maxScore: 100,
  submittedAt: new Date().toISOString(),
  feedback: "Good work on the conceptual questions. Your analysis of the key theories was thorough and well-articulated. However, there were some gaps in the practical application section that could be improved.",
  questionResults: [
    { id: 1, score: 9, maxScore: 10, feedback: "Excellent answer with good examples" },
    { id: 2, score: 7, maxScore: 10, feedback: "Good understanding but missing some key points" },
    { id: 3, score: 8, maxScore: 10, feedback: "Well-explained but could be more concise" },
  ]
};

function ExamResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundExam = examsData.find((e) => e.id === Number(id));
      if (foundExam) {
        setExam(foundExam);
        // In a real app, you would fetch the actual results from an API
        setResults(mockResults);
      } else {
        navigate("/user/s/exams");
      }
    }
    setLoading(false);
  }, [id, navigate]);

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading || !exam || !results) {
    return (
      <DashboardLayout title="Exam Results">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-600">Loading results...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Exam Results">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
            <FiCheckCircle size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{exam.title}</h1>
          <p className="text-gray-600">{exam.className}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-md text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Score</div>
            <div className={`text-2xl font-bold ${getScoreColor(results.score, results.maxScore)}`}>
              {results.score}/{results.maxScore}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Date Taken</div>
            <div className="text-lg font-medium text-gray-700">
              {formatDate(exam.dueDate)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Submitted At</div>
            <div className="text-lg font-medium text-gray-700">
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

        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-3">Question Breakdown</h2>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.questionResults.map((question, index) => (
                  <tr key={question.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Question {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getScoreColor(question.score, question.maxScore)}>
                        {question.score}/{question.maxScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {question.feedback}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => navigate('/user/s/exams')}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Back to Exams
        </button>
      </div>
    </DashboardLayout>
  );
}

export default ExamResultsPage;