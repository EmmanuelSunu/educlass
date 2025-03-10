
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import { examsData } from "../../data/exams";
import { FiClock, FiCalendar, FiArrowLeft } from "react-icons/fi";

function StudentResultDetails() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<any>({
    examTitle: "",
    examClass: "",
    examType: "",
    score: 0,
    status: "failed",
    timeTaken: "",
    dateTaken: "",
    questions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the exam by ID
    const exam = examsData.find((e) => e.id === Number(examId));
    if (!exam) {
      navigate("/user/s/results");
      return;
    }

    // Generate mock results for this exam
    const score = Math.floor(Math.random() * 100) + 1;
    const dateTaken = new Date(
      new Date(exam.dueDate).getTime() - Math.random() * 86400000 * 5
    ).toLocaleDateString();
    const hours = Math.floor(Math.random() * exam.durationHours);
    const minutes = Math.floor(Math.random() * exam.durationMinutes);
    const timeTaken = `${hours ? hours + "h " : ""}${
      minutes ? minutes + "m" : ""
    }`;

    // Create mock questions results
    const questionsResults = exam.questions.map((q: any) => {
      const isEssay = q.type === "essay";
      const isCorrect = isEssay ? true : Math.random() > 0.3; // For essay answers, we don't mark right/wrong
      let userAnswer = "";
      
      if (isEssay) {
        // Mock essay answer
        userAnswer = "This is a sample student response to the essay question that demonstrates understanding of the topic.";
      } else if (q.type === "multi-choice") {
        // Mock multiple choice answer
        userAnswer = isCorrect ? q.questionAnswer : q.options[Math.floor(Math.random() * q.options.length)];
      } else if (q.type === "fill-ins") {
        // Mock fill-in answer
        userAnswer = isCorrect ? q.questionAnswer : q.questionAnswer.split("").reverse().join("");
      }

      return {
        question: q.questionText,
        type: q.type,
        isCorrect,
        userAnswer,
        correctAnswer: q.questionAnswer,
      };
    });

    setResults({
      examTitle: exam.title,
      examClass: exam.className,
      examType: exam.type,
      score,
      status: score >= 60 ? "passed" : "failed",
      timeTaken,
      dateTaken,
      questions: questionsResults,
    });

    setLoading(false);
  }, [examId, navigate]);

  const goBack = () => {
    navigate("/user/s/results");
  };

  if (loading) {
    return (
      <DashboardLayout title="Exam Results Details" buttonTitle="">
        <div className="p-4 text-center">Loading results...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Exam Results Details" buttonTitle="">
      <div className="mb-4">
        <button
          onClick={goBack}
          className="inline-flex items-center text-primary hover:underline"
        >
          <FiArrowLeft className="mr-1" /> Back to Results
        </button>
      </div>

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
              <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
                results.status === "passed" 
                ? "border-green-500 bg-white text-green-600" 
                : "border-red-500 bg-white text-red-600"
              } mr-4`}>
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
            {results.questions.map((q: any, index: number) => (
              <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 font-medium mr-3 shrink-0">
                    {index + 1}
                  </div>
                  <div className="grow">
                    <p className="font-medium mb-3">{q.question}</p>

                    {q.type === "essay" ? (
                      <div className="p-3 rounded-lg mb-3 bg-blue-50 border border-blue-100">
                        <p className="text-sm text-gray-600 mb-1">Your Essay Response:</p>
                        <p className="text-gray-700">{q.userAnswer}</p>
                        <p className="mt-2 text-sm text-gray-500 italic">
                          Essay responses are manually evaluated by your instructor.
                        </p>
                      </div>
                    ) : (
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
                    )}

                    {!q.isCorrect && q.type !== "essay" && (
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
    </DashboardLayout>
  );
}

export default StudentResultDetails;
