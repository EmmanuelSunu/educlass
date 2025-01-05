import React from "react";
import { useNavigate } from "react-router-dom";
import { RiEyeLine, RiTimeLine, RiCalendarLine } from "react-icons/ri";

interface ExamCardProps {
  id: number; // Added ID for navigation
  title: string;
  type: "exam" | "test" | "assignment";
  duration: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "in-progress" | "completed";
  dueDate: string;
  className?: string;
}

const ExamCard: React.FC<ExamCardProps> = ({
  id,
  title,
  duration,
  status,
  dueDate,
  className = "",
}) => {
  const navigate = useNavigate();

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-600",
    "in-progress": "bg-yellow-100 text-yellow-600",
    completed: "bg-green-100 text-green-600",
  };

  const handleViewDetails = () => {
    navigate(`/exams/details/${id}`); // Navigate to the details page
  };

  return (
    <div
      className={`border rounded-md p-6 flex flex-col gap-4 bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {/* Row 1: Title and Status */}
      <div className="flex justify-between items-center">
        <h5 className="text-lg font-bold text-dark">{title}</h5>
        <span
          className={`px-3 py-1 rounded-full text-sm capitalize ${statusColors[status]}`}
        >
          {status}
        </span>
      </div>

      {/* Row 2: Due Date, Duration, and View Details */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <RiCalendarLine className="text-lg text-gray-500" />
          <span className="uppercase">{new Date(dueDate).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <RiTimeLine className="text-lg text-gray-500" />
          <span className="capitalize">{duration}</span>
        </div>
        <button
          onClick={handleViewDetails}
          className="text-lg text-blue-600 hover:text-blue-700 transition-colors"
          aria-label={`View ${title} details`}
        >
          <RiEyeLine />
        </button>
      </div>
    </div>
  );
};

export default ExamCard;
