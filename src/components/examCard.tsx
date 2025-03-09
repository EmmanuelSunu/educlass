import React from "react";
import { useNavigate } from "react-router-dom";
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
  duration,
  startTime,
  endTime,
  status,
  dueDate,
  className,
}) => {
  const navigate = useNavigate();

  const statusColors = {
    scheduled: "bg-purple-100 text-purple-600 border-purple-200",
    "in-progress": "bg-amber-100 text-amber-600 border-amber-200",
    completed: "bg-emerald-100 text-emerald-600 border-emerald-200",
    available: "bg-blue-100 text-blue-600 border-blue-200"
  };

  // Determine actual status based on date
  const determineStatus = () => {
    const now = new Date();
    const examDate = new Date(dueDate);

    // Check if dates are same (only comparing year, month, day)
    const isSameDay = (d1: Date, d2: Date) => 
      d1.getFullYear() === d2.getFullYear() && 
      d1.getMonth() === d2.getMonth() && 
      d1.getDate() === d2.getDate();

    if (examDate < now && !isSameDay(examDate, now)) {
      return "completed";
    } else if (isSameDay(examDate, now)) {
      // Check if current time is within exam hours
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const currentTimeValue = currentHour * 60 + currentMinute;
      const startTimeValue = startHour * 60 + startMinute;
      const endTimeValue = endHour * 60 + endMinute;

      if (currentTimeValue >= startTimeValue && currentTimeValue <= endTimeValue) {
        return "available";
      } else if (currentTimeValue < startTimeValue) {
        return "scheduled"; // Same day but not started yet
      } else {
        return "completed"; // Same day but already ended
      }
    } else {
      return "scheduled"; // Future date
    }
  };

  const currentStatus = determineStatus();
  const statusDisplay = currentStatus === "available" ? "Available" : status;


  const handleCardClick = () => {
    // Determine the correct path based on which module we're in (lecturer or student)
    const isLecturerPath = window.location.pathname.includes('/user/l/');
    const basePath = isLecturerPath ? '/user/l/exams/details/' : '/user/s/exams/details/';
    navigate(`${basePath}${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-200 cursor-pointer relative"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[currentStatus]}`}
        >
          {statusDisplay}
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