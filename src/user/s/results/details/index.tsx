
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiClock, FiCalendar } from "react-icons/fi";
import DashboardLayout from "../layout";
import { examsData } from "../../data/exams";

type Question = {
  question: string;
  yourAnswer: string;
  isCorrect: boolean;
  type?: string;
  feedback?: string;
};

type Results = {
  examTitle: string;
  examClass: string;
  examType: string;
  score: number;
  status: "passed" | "failed";
  timeTaken: string;
  dateTaken: string;
  overallFeedback: string;
  questions: Question[];
};

function StudentResultDetails() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<Results>({
    examTitle: "",
    examClass: "",
    examType: "",
    score: 0,
    status: "failed",
    timeTaken: "",
    dateTaken: "",
    overallFeedback: "",
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

    // Generate feedback based on score
    const overallFeedback = score >= 80 
      ? "Very Good" 
      : score >= 60 
      ? "Good" 
      : score >= 40 
      ? "Fair" 
      : "Needs Improvement";

    // Generate mock answers and feedback for questions
    const mockQuestions = exam.questions.map((q) => {
      const isEssay = q.type === "essay";
      const isCorrect = isEssay ? Math.random() > 0.3 : Math.random() > 0.3;
      
      // For multiple choice
      let yourAnswer = "";
      if (!isEssay && q.options) {
        yourAnswer = isCorrect
          ? q.questionAnswer
          : q.options[Math.floor(Math.random() * q.options.length)];
      } else if (isEssay) {
        // Mock essay answer
        yourAnswer = "A comprehensive explanation of encapsulation, inheritance, polymorphism, and abstraction with relevant examples.";
      }

      // Generate feedback for essay questions
      const feedback = isEssay
        ? isCorrect
          ? "Excellent explanation that covers all key concepts with clear examples."
          : "Your answer lacks depth in explaining polymorphism. Consider adding more concrete examples."
        : "";

      return {
        question: q.questionText,
        yourAnswer,
        isCorrect,
        type: q.type,
        feedback,
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
      overallFeedback,
      questions: mockQuestions,
    });

    setLoading(false);
  }, [examId, navigate]);

  const goBack = () => {
    navigate("/user/s/results");
  };

  const renderStudentAnswer = (question: Question) => {
    if (question.type === "essay") {
      return (
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">Your Answer:</p>
          <div className="bg-white p-3 rounded-md border border-slate-200 mb-3">
            <p className="text-slate-700">{question.yourAnswer}</p>
          </div>
          
          <p className="text-sm font-medium text-slate-600 mb-1">Feedback:</p>
          <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
            <p className="text-slate-700">{question.feedback}</p>
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <p className="text-sm font-medium text-slate-600 mb-1">Your Answer:</p>
        <div className="bg-white p-3 rounded-md border border-slate-200">
          <p className="text-slate-700">{question.yourAnswer}</p>
        </div>
      </div>
    );
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

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{results.examTitle}</h1>
          <p className="text-slate-600 mb-6">{results.examClass} • {results.examType}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-sm text-slate-500 mb-1">Score</h3>
              <p className={`text-3xl font-bold ${results.status === "passed" ? "text-blue-600" : "text-red-600"}`}>
                {results.score}%
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-sm text-slate-500 mb-1">Overall Feedback</h3>
              <p className="text-xl font-semibold text-slate-800">{results.overallFeedback}</p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-sm text-slate-500 mb-1">Time Taken</h3>
              <p className="text-xl font-semibold text-slate-800 flex items-center">
                <FiClock className="mr-2 text-slate-400" />
                {results.timeTaken || "31 minutes"}
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-sm text-slate-500 mb-1">Date Taken</h3>
              <p className="text-xl font-semibold text-slate-800 flex items-center">
                <FiCalendar className="mr-2 text-slate-400" />
                {results.dateTaken}
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-4">Questions & Answers</h2>
          
          <div className="space-y-6">
            {results.questions.map((q, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-lg border ${
                  q.isCorrect 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start">
                  <div className={`mr-3 mt-1 ${q.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {q.isCorrect ? <FiCheckCircle size={20} /> : <FiXCircle size={20} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 mb-2">Question {index + 1}</h3>
                    <p className="text-slate-700 mb-4">{q.question}</p>
                    {renderStudentAnswer(q)}
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
