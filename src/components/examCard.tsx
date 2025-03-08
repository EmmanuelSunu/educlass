
import React from "react";
import { useNavigate } from "react-router-dom";
import { BsBook } from "react-icons/bs";
import { MdOutlineAccessTime } from "react-icons/md";

interface ExamCardProps {
  id: number;
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
  type,
  duration,
  startTime,
  endTime,
  status,
  dueDate,
  className,
}) => {
  const navigate = useNavigate();

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-600 border-blue-200",
    "in-progress": "bg-amber-100 text-amber-600 border-amber-200",
    completed: "bg-emerald-100 text-emerald-600 border-emerald-200",
  };

  const typeIcons = {
    exam: <BsBook className="text-primary" />,
    test: <BsBook className="text-yellow-500" />,
    assignment: <BsBook className="text-green-500" />,
  };

  const handleCardClick = () => {
    navigate(`/user/l/exams/details/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {typeIcons[type]}
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}
        >
          {status}
        </span>
      </div>

      {className && (
        <div className="mb-3">
          <span className="text-sm text-slate-500 font-medium">Class:</span>
          <span className="ml-2 text-sm text-slate-700">{className}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-medium">Date</span>
          <span className="text-sm text-slate-700">{dueDate}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-medium">Duration</span>
          <div className="flex items-center gap-1">
            <MdOutlineAccessTime className="text-slate-400" />
            <span className="text-sm text-slate-700">{duration}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-medium">Start</span>
          <span className="text-sm text-slate-700">{startTime}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-medium">End</span>
          <span className="text-sm text-slate-700">{endTime}</span>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
