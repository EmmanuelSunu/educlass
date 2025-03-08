
import React from "react";
import { useNavigate } from "react-router-dom";
import { BsClock, BsCalendar, BsBook } from "react-icons/bs";

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
      className="bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="p-5">
        <div className="flex flex-row items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {typeIcons[type]}
            <span className="text-xs font-medium uppercase text-slate-500">{type}</span>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
              statusColors[status]
            }`}
          >
            {status}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-800 mb-3 line-clamp-2">{title}</h3>
        
        {className && (
          <div className="flex items-center text-slate-600 mb-4 text-sm">
            <BsBook className="mr-2" />
            <span>{className}</span>
          </div>
        )}
        
        <div className="border-t border-slate-100 pt-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center">
              <BsClock className="text-slate-400 mr-2" />
              <span className="text-sm text-slate-600">{duration}</span>
            </div>
            <div className="flex items-center">
              <BsCalendar className="text-slate-400 mr-2" />
              <span className="text-sm text-slate-600">{dueDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
