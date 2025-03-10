import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { RiArrowRightLine, RiTimeLine, RiCalendarLine } from "react-icons/ri";
import URLS from "../url";

interface Exam {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
  className: string;
}

interface ExamsListProps {
  exams: Exam[];
  emptyMessage: string;
}

const ExamsList: React.FC<ExamsListProps> = ({ exams, emptyMessage }) => {
  if (exams.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {exams.map((exam) => (
        <div key={exam.id} className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-medium text-gray-900">
                {exam.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {exam.description}
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span className="inline-flex items-center mr-4">
                  <RiCalendarLine className="mr-1.5" />
                  {format(new Date(exam.dueDate), "MMMM d, yyyy")}
                </span>
                <span className="inline-flex items-center">
                  <RiTimeLine className="mr-1.5" />
                  {exam.startTime} - {exam.endTime}
                </span>
              </div>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    exam.status === "scheduled"
                      ? "bg-blue-100 text-blue-800"
                      : exam.status === "in-progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {exam.status === "scheduled"
                    ? "Scheduled"
                    : exam.status === "in-progress"
                    ? "In Progress"
                    : "Completed"}
                </span>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {exam.className}
                </span>
              </div>
            </div>
            <div>
              <Link
                to={URLS.EXAM_DETAILS(exam.id.toString())}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {exam.status === "completed" ? "View Results" : "View Details"}
                <RiArrowRightLine className="ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExamsList;