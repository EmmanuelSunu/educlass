import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import examsData from "../data/exams.json";
import { RiQuestionFill } from "react-icons/ri";
import DashboardLayout from "../../layout";

// Updated Question interface to match the new structure
interface Question {
  id: string;
  type: "essay" | "multi-choice" | "fill-ins";
  questionText: string;
  options?: string[];
  questionAnswer: string;
}

interface ExamDetails {
  id: number;
  title: string;
  type: string;
  duration: string;
  durationHours?: number;
  durationMinutes?: number;
  startTime: string;
  endTime: string;
  status: "scheduled" | "in-progress" | "completed";
  dueDate: string;
  description: string;
  classId?: number;
  className?: string;
  questions: Question[];
}

function ExamDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);

  useEffect(() => {
    if (id) {
      const exam = examsData.find(exam => exam.id === Number(id));
      if (exam) {
        setExamDetails(exam as ExamDetails);
      }
    }
  }, [id]);

  if (!examDetails) {
    return <div>Loading...</div>;
  }

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-600",
    "in-progress": "bg-yellow-100 text-yellow-600",
    completed: "bg-green-100 text-green-600",
  };

  const handleEditClick = () => {
    navigate(`/user/l/exams/create/${examDetails.id}`);
  };

  // Helper function to render question based on type
  const renderQuestionContent = (question: Question) => {
    return (
      <div className="flex flex-col">
        <p className="text-p mb-3">{question.questionText}</p>
        {question.type === 'multi-choice' && question.options && (
          <div className="ml-6 mb-4">
            {question.options.map((option, i) => (
              <div
                key={i}
                className={`mb-2 p-2 border ${
                  option === question.questionAnswer
                    ? 'bg-green-50 border-green-300'
                    : 'border-gray-200'
                } rounded-md`}
              >
                <span
                  className={`${
                    option === question.questionAnswer
                      ? 'text-green-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {option}
                  {option === question.questionAnswer && (
                    <span className="ml-2 text-green-600">(Correct Answer)</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
        {question.type === 'fill-ins' && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <span className="text-p font-semibold text-blue-700">Correct Answer: </span>
            <span className="text-p text-blue-900">{question.questionAnswer}</span>
          </div>
        )}
        {question.type === 'essay' && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <span className="text-p font-semibold text-blue-700">Model Answer: </span>
            <span className="text-p text-blue-900">{question.questionAnswer}</span>
            <p className="mt-2 text-xs text-blue-700">
              Note: Essay answers require manual grading and assessment against this model answer.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout
      title="Exam Details"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="p-6 bg-white rounded-md shadow-md flex flex-col gap-5">
        <div className="border border-slate-200 rounded-lg p-8">
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between mb-4">
              <div className="flex flex-col">
                <h6 className="text-h6 text-slate-500">Title</h6>
                <h5 className="text-h5 mb-4 text-dark">{examDetails.title}</h5>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm capitalize ${
                    statusColors[examDetails.status]
                  }`}
                >
                  {examDetails.status}
                </span>
                <button 
                  onClick={handleEditClick}
                  className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Exam</span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-8">
              <div className="flex flex-col gap-1">
                <span className="text-p text-gray-400 font-normal">Date</span>
                <h6 className="text-p text-slate-900">{examDetails.dueDate}</h6>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-p text-gray-400 font-normal">
                  Duration
                </span>
                <h6 className="text-p text-slate-900">
                  {examDetails.duration}
                </h6>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-p text-gray-400 font-normal">
                  Start Time
                </span>
                <h6 className="text-p text-slate-900">
                  {examDetails.startTime === "00:00" ? "Any time" : examDetails.startTime}
                </h6>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-p text-gray-400 font-normal">
                  End Time
                </span>
                <h6 className="text-p text-slate-900">
                  {examDetails.endTime === "23:59" ? "Any time" : examDetails.endTime}
                </h6>
              </div>
            </div>

            {examDetails.description && (
              <div className="mt-4">
                <span className="text-p text-gray-400 font-normal">Description</span>
                <p className="text-p text-slate-900">{examDetails.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {examDetails.questions.map((question) => (
            <div key={question.id}>
              <div className="flex rounded-lg rounded-b-none flex-row items-center justify-start bg-gray-100 p-4 gap-2">
                <RiQuestionFill className="text-2xl text-blue-500" />
                <h5 className="text-h5 font-semibold">Question {question.id}</h5>
                <span className="ml-auto px-2 py-1 text-xs font-medium uppercase bg-blue-100 text-blue-700 rounded">
                  {question.type}
                </span>
              </div>
              <div className="mb-2 border flex flex-col gap-4 border-gray-200 rounded-lg rounded-t-none p-5">
                {renderQuestionContent(question)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ExamDetailsPage;