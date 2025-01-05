import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import examsData from "../data/exams.json";
import { RiQuestionFill } from "react-icons/ri";
import DashboardLayout from "../../layout";

interface Question {
  id: string;
  type: "essay" | "multi-choice" | "fill-ins";
  questionText: string;
  questionAnswer: string;
}

interface ExamDetails {
  id: number;
  title: string;
  type: string;
  duration: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "in-progress" | "completed";
  dueDate: string;
  description: string;
  questions: Question[];
}

function ExamDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);

  useEffect(() => {
    if (id) {
      const exam = examsData.find(
        (exam) => exam.id === Number(id)
      ) as ExamDetails;
      setExamDetails(exam);
    }
  }, [id]);

  if (!examDetails) {
    return <div>Loading...</div>;
  }

  const handleQuestionChange = (index: number, value: string) => {
    if (!examDetails) return;
    const updatedQuestions = [...examDetails.questions];
    updatedQuestions[index].questionText = value;
    setExamDetails({ ...examDetails, questions: updatedQuestions });
  };

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-600",
    "in-progress": "bg-yellow-100 text-yellow-600",
    completed: "bg-green-100 text-green-600",
  };

  return (
    <DashboardLayout
      title="Classes"
      showAddHeadbarButton={true}
      buttonTitle="Add Class"
    >
      <div className="p-6 bg-white rounded-md shadow-md flex flex-col gap-5">
        <div className="border border-slate-200 rounded-lg p-8">
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between mb-4">
              <div className="flex flex-col">
                <h6 className="text-h6 text-slate-500">Title</h6>
                <h5 className="text-h5 mb-4 text-dark">{examDetails.title}</h5>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm capitalize ${
                  statusColors[examDetails.status]
                }`}
              >
                {examDetails.status}
              </span>
            </div>
            <div className="flex justify-between">
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
                  {examDetails.startTime}
                </h6>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-p text-gray-400 font-normal">
                  End Time
                </span>
                <h6 className="text-p text-slate-900">{examDetails.endTime}</h6>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {examDetails.questions.map((question) => (
            <div key={question.id}>
              <div className="flex rounded-lg rounded-b-none flex-row items-center justify-start bg-lightGray p-5 gap-2">
                <RiQuestionFill className="text-2xl text-blue-500" />
                <h5 className="text-h5 font-semibold">
                  Question {question.id}
                </h5>
              </div>
              <div className="mb-2 border flex flex-col gap-3 border-gray-200 rounded-lg rounded-t-none p-5">
                <div className="flex flex-col gap">
                  <p className="font-semibold text-slate-500">Question</p>
                  <p className="font-normal text-gray-400">
                    {question.questionText}
                  </p>
                </div>
                <div className="flex flex-col gap">
                  <p className="font-semibold text-slate-500">
                    Expected Answer
                  </p>
                  <p className="font-normal text-gray-400">
                    {question.questionAnswer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ExamDetailsPage;
