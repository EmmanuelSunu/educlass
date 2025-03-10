
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import examsData from "../../../l/exams/data/exams.json";
import { FiArrowLeft, FiClock, FiCalendar } from "react-icons/fi";

interface ExamResult {
  examId: number;
  score: number;
  status: "passed" | "failed";
  examTitle: string;
  examClass: string;
  examType: string;
  timeTaken: string;
  dateTaken: string;
  questions: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

function StudentResultDetails() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading exam results
    setLoading(true);

    // Find the exam in the exams data
    const exam = examsData.find((e) => e.id === Number(examId));

    if (exam) {
      // Generate mock result for this exam
      const score = Math.floor(Math.random() * 41) + 60; // Score between 60-100
      const mockQuestions = exam.questions.map((q) => {
        const isCorrect = Math.random() > 0.3; // 70% correct answers
        return {
          question: q.questionText,
          userAnswer: isCorrect ? q.questionAnswer : "Mock incorrect answer",
          correctAnswer: q.questionAnswer,
          isCorrect,
        };
      });

      const mockResult = {
        examId: exam.id,
        score,
        status: score >= 70 ? "passed" : "failed",
        examTitle: exam.title,
        examClass: exam.className,
        examType: ["Quiz", "Midterm", "Final", "Assessment"][
          Math.floor(Math.random() * 4)
        ],
        timeTaken: `${Math.floor(Math.random() * 30) + 15} min`,
        dateTaken: new Date(
          new Date(exam.dueDate).getTime() - Math.random() * 86400000
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        questions: mockQuestions,
      } as ExamResult;

      setResults(mockResult);
    }
    
    setLoading(false);
  }, [examId]);

  const handleBack = () => {
    navigate("/user/s/results");
  };

  if (loading) {
    return (
      <DashboardLayout title="Exam Result Details">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!results) {
    return (
      <DashboardLayout title="Exam Result Details">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">Result not found for the specified exam.</p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Back to Results
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Exam Result Details">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={handleBack}
          className="flex items-center text-primary mb-6 hover:underline"
        >
          <FiArrowLeft className="mr-2" /> Back to Results
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{results.examTitle}</h1>
                <p className="text-gray-500 mb-4">
                  {results.examClass} • {results.examType}
                </p>
              </div>

              <div className="flex items-center bg-primary/10 p-4 rounded-lg mt-4 md:mt-0">
                <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-primary bg-white text-primary mr-4">
                  <span className="text-2xl font-bold">{results.score}%</span>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      results.status === "passed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {results.status === "passed" ? "Passed" : "Failed"}
                  </span>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <FiClock className="mr-1" />
                    {results.timeTaken}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCalendar className="mr-1" />
                    {results.dateTaken}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Questions & Answers</h2>

            <div className="space-y-6">
              {results.questions.map((q, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 font-medium mr-3 shrink-0">
                      {index + 1}
                    </div>
                    <div className="grow">
                      <p className="font-medium mb-3">{q.question}</p>

                      <div
                        className={`p-3 rounded-lg mb-3 ${
                          q.isCorrect
                            ? "bg-green-50 border border-green-100"
                            : "bg-red-50 border border-red-100"
                        }`}
                      >
                        <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                        <p
                          className={
                            q.isCorrect ? "text-green-700" : "text-red-700"
                          }
                        >
                          {q.userAnswer}
                        </p>
                      </div>

                      {!q.isCorrect && (
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                          <p className="text-sm text-gray-600 mb-1">
                            Correct Answer:
                          </p>
                          <p className="text-blue-700">{q.correctAnswer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentResultDetails;
