
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import examsData from "../../../l/exams/data/exams.json";

// Mock results data
const mockResults = {
  totalScore: 85,
  maxScore: 100,
  feedback: "Good job! You demonstrated a solid understanding of the concepts.",
  questionFeedback: [
    {
      questionId: 1,
      score: 8,
      maxScore: 10,
      feedback: "Good explanation, but could be more detailed."
    },
    {
      questionId: 2,
      score: 9,
      maxScore: 10,
      feedback: "Excellent answer with clear reasoning."
    },
    {
      questionId: 3,
      score: 7,
      maxScore: 10,
      feedback: "Partially correct. Consider reviewing section 3.2 in the textbook."
    }
  ]
};

function ExamResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState(null);
  const [results, setResults] = useState(null);
  
  useEffect(() => {
    if (id) {
      const exam = examsData.find(
        (exam) => exam.id === Number(id)
      );
      
      if (exam) {
        setExamDetails(exam);
        
        // In a real app, you would fetch the actual results from the backend
        // For now, we're using mock data
        setResults(mockResults);
      } else {
        // Exam not found
        navigate('/user/s/exams');
      }
    }
  }, [id, navigate]);

  if (!examDetails || !results) {
    return (
      <DashboardLayout
        title="Loading..."
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-600">Loading results...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate score percentage
  const scorePercentage = Math.round((results.totalScore / results.maxScore) * 100);
  
  // Determine grade color
  let gradeColor = "text-red-600";
  if (scorePercentage >= 90) {
    gradeColor = "text-emerald-600";
  } else if (scorePercentage >= 80) {
    gradeColor = "text-green-600";
  } else if (scorePercentage >= 70) {
    gradeColor = "text-amber-600";
  } else if (scorePercentage >= 60) {
    gradeColor = "text-orange-600";
  }

  return (
    <DashboardLayout
      title="Exam Results"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">{examDetails.title} - Results</h1>
        
        {/* Score Summary */}
        <div className="mb-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex flex-col items-center mb-4">
            <div className={`text-5xl font-bold ${gradeColor}`}>
              {scorePercentage}%
            </div>
            <div className="text-slate-600 mt-2">
              Score: {results.totalScore}/{results.maxScore}
            </div>
          </div>
          
          <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden mb-4">
            <div 
              className={`h-full rounded-full ${
                scorePercentage >= 80 ? "bg-green-500" :
                scorePercentage >= 70 ? "bg-amber-500" :
                scorePercentage >= 60 ? "bg-orange-500" : "bg-red-500"
              }`}
              style={{ width: `${scorePercentage}%` }}
            ></div>
          </div>
          
          <div className="text-center text-slate-700">
            {results.feedback}
          </div>
        </div>
        
        {/* Detailed Feedback */}
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Question Feedback</h2>
        <div className="space-y-4">
          {examDetails.questions.map((question, index) => {
            const feedbackItem = results.questionFeedback.find(
              item => item.questionId === question.id
            );
            
            if (!feedbackItem) return null;
            
            return (
              <div key={question.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-slate-800">Question {index + 1}</h3>
                  <div className="bg-slate-100 px-3 py-1 rounded-full text-sm font-medium text-slate-700">
                    {feedbackItem.score}/{feedbackItem.maxScore}
                  </div>
                </div>
                
                <p className="text-slate-700 mb-3">{question.questionText}</p>
                
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200 mb-3">
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Your Answer:</h4>
                  <p className="text-slate-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. (Mock student answer)</p>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-700 mb-1">Feedback:</h4>
                  <p className="text-blue-600">{feedbackItem.feedback}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => navigate('/user/s/exams')}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
          >
            Back to Exams
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ExamResultsPage;
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
