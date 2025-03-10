import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiFileText, FiBook } from 'react-icons/fi';
import DashboardLayout from '../layout/index';
import examsData from '../../l/exams/data/exams.json';
// Mock student class IDs for demo purposes
const studentClassIds = [1, 2, 3, 4];

interface ExamResult {
  examId: number;
  score: number;
  status: "passed" | "failed";
  submittedAt: string;
  examTitle: string;
  examClass: string;
  examType: string;
  timeTaken: string;
  feedback: string;
}

function StudentResults() {
  const navigate = useNavigate();
  const [completedExams, setCompletedExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading exam results
    setLoading(true);

    // Get exams data and filter for completed exams
    const typedExamsData = examsData as any[];
    const studentExams = typedExamsData.filter(
      (exam) =>
        studentClassIds.includes(exam.classId) &&
        new Date(exam.dueDate) < new Date(),
    );

    // Generate mock results for completed exams
    const mockResults = studentExams.map((exam) => {
      const score = Math.floor(Math.random() * 41) + 60; // Score between 60-100
      const timeTaken = `${Math.floor(Math.random() * 30) + 15} min`;
      let feedback = "";

      if (score >= 90) feedback = "Excellent";
      else if (score >= 80) feedback = "Good";
      else if (score >= 70) feedback = "Fair";
      else feedback = "Poor";

      return {
        examId: exam.id,
        score,
        status: score >= 70 ? "passed" : "failed",
        submittedAt: new Date(
          new Date(exam.dueDate).getTime() - Math.random() * 86400000,
        ).toISOString(),
        examTitle: exam.title,
        examClass: exam.className,
        examType: ["Quiz", "Midterm", "Final", "Assessment"][Math.floor(Math.random() * 4)],
        timeTaken,
        feedback
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

  return (
    <DashboardLayout title="Exam Results">
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Exam Results</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedExams.map((result) => (
              <div
                key={result.examId}
                onClick={() => handleResultClick(result.examId)}
                className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      result.status === "passed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {result.status === "passed" ? "Passed" : "Failed"}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">{result.examType}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                    {result.examTitle}
                  </h3>

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FiBook className="mr-1" />
                    <span className="line-clamp-1">{result.examClass}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiCalendar className="mr-1" />
                      <span>{new Date(result.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiClock className="mr-1" />
                      <span>{result.timeTaken}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <span className={`text-xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {result.feedback}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentResults;