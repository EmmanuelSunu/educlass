
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";
import examsData from "../../l/exams/data/exams.json";
import { studentClassIds } from "../exams/mock-data";

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

  const handleViewResults = (examId: number) => {
    navigate(`/user/s/results/${examId}`);
  };

  return (
    <DashboardLayout title="Exam Results">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Exam Results</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : completedExams.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No exam results available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {completedExams.map((result) => (
              <div
                key={result.examId}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold">{result.examTitle}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {result.examClass} • {result.examType}
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted:{" "}
                      {new Date(result.submittedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-primary bg-primary/10 text-primary">
                        <span className="text-xl font-bold">{result.score}%</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                          result.status === "passed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {result.status === "passed" ? "Passed" : "Failed"}
                      </span>
                      <button
                        onClick={() => handleViewResults(result.examId)}
                        className="text-primary hover:underline text-sm"
                      >
                        View Details
                      </button>
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
