import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiClock,
  FiArrowLeft,
} from "react-icons/fi";
import DashboardLayout from "../../layout/index";
import examsData from "../../../l/exams/data/exams.json";

interface Question {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  feedback: string;
  score: number;
  maxScore: number;
}

interface ExamResult {
  examId: number;
  score: number;
  maxScore: number;
  passingScore: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: string;
  submittedAt: string;
  feedback: string;
  questions: Question[];
  examTitle: string;
  examClass: string;
  examType: string;
}

function StudentResultDetails() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Find the exam in the data
    const typedExamsData = examsData as any[];
    const exam = typedExamsData.find((e) => e.id === Number(examId));

    if (exam) {
      // Generate mock results for the exam
      const mockQuestions = exam.questions.map((q: any) => {
        const isCorrect = Math.random() > 0.3;
        const maxScore = Math.floor(Math.random() * 3) + 3; // 3-5 points per question
        const score = isCorrect
          ? maxScore
          : Math.floor(Math.random() * (maxScore - 1)); // Less than max if incorrect

        const yourAnswer = isCorrect
          ? q.questionAnswer
          : q.options
            ? q.options[Math.floor(Math.random() * q.options.length)]
            : "Student's answer that wasn't correct";

        let feedback = "";
        if (isCorrect) {
          feedback = [
            "Excellent answer! You've demonstrated a thorough understanding of the concept.",
            "Good job! Your response shows a clear grasp of the material.",
            "Well done! Your answer addresses all key points.",
          ][Math.floor(Math.random() * 3)];
        } else {
          feedback = [
            "Your answer is partially correct, but misses some key points. Review the material on this topic.",
            "Your answer shows some understanding, but there are significant gaps in comprehension.",
            "This answer needs improvement. Consider revisiting the concept in your study materials.",
          ][Math.floor(Math.random() * 3)];
        }

        return {
          question: q.questionText,
          yourAnswer,
          correctAnswer: q.questionAnswer,
          isCorrect,
          feedback,
          score,
          maxScore,
        };
      });

      const correctCount = mockQuestions.filter(
        (q: Question) => q.isCorrect,
      ).length;
      const totalQuestions = mockQuestions.length;
      const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
      const totalScore = mockQuestions.reduce(
        (acc: number, q: Question) => acc + q.score,
        0,
      );
      const maxPossibleScore = mockQuestions.reduce(
        (acc: number, q: Question) => acc + q.maxScore,
        0,
      );

      let overallFeedback = "";
      if (scorePercentage >= 90) overallFeedback = "Excellent";
      else if (scorePercentage >= 80) overallFeedback = "Very Good";
      else if (scorePercentage >= 70) overallFeedback = "Good";
      else if (scorePercentage >= 60) overallFeedback = "Fair";
      else overallFeedback = "Poor";

      const mockResults: ExamResult = {
        examId: Number(examId),
        score: scorePercentage,
        maxScore: maxPossibleScore,
        passingScore: 60,
        correctAnswers: correctCount,
        totalQuestions,
        timeSpent: `${Math.floor(Math.random() * 30) + 15} minutes`,
        submittedAt: new Date(
          new Date(exam.dueDate).getTime() - Math.random() * 86400000,
        ).toISOString(),
        feedback: overallFeedback,
        questions: mockQuestions,
        examTitle: exam.title,
        examClass: exam.className,
        examType: ["Quiz", "Midterm", "Final", "Assessment"][
          Math.floor(Math.random() * 4)
        ],
      };

      setResults(mockResults);
    }

    setLoading(false);
  }, [examId]);

  const renderStudentAnswer = (question: Question) => {
    return (
      <div className="mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Your Answer:</p>
            <p className="text-sm bg-white p-2 rounded border">
              {question.yourAnswer}
            </p>
          </div>

          {!question.isCorrect && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Correct Answer:</p>
              <p className="text-sm bg-white p-2 rounded border">
                {question.correctAnswer}
              </p>
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-gray-500">Feedback:</p>
            <p className="text-xs font-semibold text-gray-500">
              Score: {question.score}/{question.maxScore}
            </p>
          </div>
          <p className="text-sm mt-1 italic text-gray-700">
            {question.feedback}
          </p>
        </div>
      </div>
    );
  };

  const getScoreColorClass = (score: number): string => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout title="Result Details">
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : results ? (
          <>
            <div className="mb-6">
              <button
                onClick={() => navigate("/user/s/results")}
                className="flex items-center text-primary hover:text-primary/80"
              >
                <FiArrowLeft className="mr-1" /> Back to Results
              </button>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {results.examTitle}
              </h1>
              <p className="text-gray-600">
                {results.examClass} • {results.examType}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Score</p>
                  <p
                    className={`text-2xl font-bold ${getScoreColorClass(results.score)}`}
                  >
                    {results.score}%
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Overall Feedback</p>
                  <p className="text-lg font-semibold">{results.feedback}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Time Taken</p>
                  <div className="flex items-center">
                    <FiClock className="mr-1 text-gray-400" />
                    <p className="text-lg">{results.timeSpent}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Date Taken</p>
                  <div className="flex items-center">
                    <FiCalendar className="mr-1 text-gray-400" />
                    <p className="text-lg">
                      {new Date(results.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Questions & Answers
              </h2>

              <div className="space-y-6">
                {results.questions.map((q, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${q.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`mr-3 mt-1 ${q.isCorrect ? "text-green-500" : "text-red-500"}`}
                      >
                        {q.isCorrect ? (
                          <FiCheckCircle size={20} />
                        ) : (
                          <FiXCircle size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">
                          Question {index + 1}
                        </div>
                        <div className="text-slate-700 mt-1">{q.question}</div>
                        {renderStudentAnswer(q)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Could not find exam result data.</p>
            <button
              onClick={() => navigate("/user/s/results")}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Back to Results
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentResultDetails;
