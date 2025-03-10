
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";
import { examsData } from "../../data/exams";
import { studentClassIds } from "../../data/student";

interface ExamResult {
  examId: number;
  score: number;
  status: string;
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
        examType: ["Quiz", "Midterm", "Final", "Assessment"][
          Math.floor(Math.random() * 4)
        ],
        timeTaken,
        feedback,
      } as ExamResult;
    });

    setCompletedExams(mockResults);
    setLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    return status === "passed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <DashboardLayout title="Exam Results" buttonTitle="View All">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Exam Results</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : completedExams.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedExams.map((exam) => (
                  <tr key={exam.examId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{exam.examTitle}</div>
                        <div className="text-sm text-gray-500">{exam.examClass}</div>
                        <div className="text-xs text-gray-400">{exam.examType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{exam.score}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(exam.status)}`}>
                        {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(exam.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/user/s/results/details/${exam.examId}`)}
                        className="text-primary hover:text-primary-dark"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">No exam results yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentResults;
