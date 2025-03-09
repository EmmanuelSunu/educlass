
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layout';
import examsData from '../exams/data/exams.json';
import { FiClock, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';

// Student is enrolled in these classes (mock data)
const studentClassIds = [1, 2, 3];

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
}

interface ExamResult {
  examId: number;
  score: number;
  status: 'passed' | 'failed';
  submittedAt: string;
  examTitle: string;
  examClass: string;
}

function StudentResults() {
  const navigate = useNavigate();
  const [completedExams, setCompletedExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading exam results
    setLoading(true);
    
    // Get exams data and filter for completed exams
    const typedExamsData = examsData as Exam[];
    const studentExams = typedExamsData.filter(exam => 
      studentClassIds.includes(exam.classId) && 
      new Date(exam.dueDate) < new Date()
    );
    
    // Generate mock results for completed exams
    const mockResults = studentExams.map(exam => {
      const score = Math.floor(Math.random() * 41) + 60; // Score between 60-100
      return {
        examId: exam.id,
        score,
        status: score >= 70 ? 'passed' : 'failed',
        submittedAt: new Date(new Date(exam.dueDate).getTime() - Math.random() * 86400000).toISOString(),
        examTitle: exam.title,
        examClass: exam.className
      } as ExamResult;
    });
    
    setCompletedExams(mockResults);
    setLoading(false);
  }, []);

  const handleResultClick = (examId: number) => {
    navigate(`/user/s/results/details/${examId}`);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number): { text: string; color: string } => {
    if (score >= 90) return { text: "Excellent", color: "bg-green-100 text-green-800" };
    if (score >= 80) return { text: "Good", color: "bg-blue-100 text-blue-800" };
    if (score >= 70) return { text: "Satisfactory", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Failed", color: "bg-red-100 text-red-800" };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Exam Results</h1>
        
        {completedExams.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-medium text-gray-500">No exam results available yet</h2>
            <p className="mt-2 text-gray-500">When you complete exams, your results will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedExams.map((result) => {
              const scoreBadge = getScoreBadge(result.score);
              return (
                <div 
                  key={result.examId}
                  onClick={() => handleResultClick(result.examId)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">{result.examTitle}</h2>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${scoreBadge.color}`}>
                        {scoreBadge.text}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{result.examClass}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <span className={`text-xl font-bold ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiCalendar className="mr-1" />
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentResults;
