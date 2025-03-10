import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";
import { examsData } from "../data/exams";
import { studentClassIds } from "../data/student";
import { FiClock, FiCalendar } from "react-icons/fi";

function StudentResults() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch and process exam results
    const fetchResults = () => {
      setLoading(true);
      try {
        // For demo purposes, we'll create mock results based on exams
        const mockResults = examsData
          .filter(
            (exam) =>
              studentClassIds.includes(exam.classId) &&
              ["completed", "in-progress"].includes(exam.status)
          )
          .map((exam) => {
            const score = Math.floor(Math.random() * 100) + 1;
            const dateTaken = new Date(
              new Date(exam.dueDate).getTime() - Math.random() * 86400000 * 5
            ).toLocaleDateString();
            const hours = Math.floor(Math.random() * exam.durationHours);
            const minutes = Math.floor(Math.random() * exam.durationMinutes);
            const timeTaken = `${hours ? hours + "h " : ""}${
              minutes ? minutes + "m" : ""
            }`;

            return {
              examId: exam.id,
              examTitle: exam.title,
              examType: exam.type,
              examClass: exam.className,
              score,
              status: score >= 60 ? "passed" : "failed",
              dateTaken,
              timeTaken,
            };
          });

        setResults(mockResults);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleViewResults = (examId: number) => {
    navigate(`/user/s/results/${examId}`);
  };

  return (
    <DashboardLayout title="Exam Results" buttonTitle="View History">
      <div>
        {loading ? (
          <div className="p-4 text-center">Loading results...</div>
        ) : results.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No exam results yet
            </h3>
            <p className="mt-2 text-gray-600">
              Your completed exam results will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 card-grid">
            {results.map((result) => (
              <div
                key={result.examId}
                onClick={() => handleViewResults(result.examId)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer card-animate"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-gray-900">
                    {result.examTitle}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {result.examClass} • {result.examType}
                  </p>

                  <div className="flex items-center mb-3">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-primary bg-primary/10 text-primary mr-4">
                      <span className="text-xl font-bold">{result.score}%</span>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          result.status === "passed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {result.status === "passed" ? "Passed" : "Failed"}
                      </span>

                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <FiClock className="mr-1" />
                        {result.timeTaken}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiCalendar className="mr-1" />
                        {result.dateTaken}
                      </div>
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