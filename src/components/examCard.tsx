import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiHelpCircle } from "react-icons/fi";
import { getExamStatus, getStatusInfo } from "../utils/examStatus";
import { type Exam } from "../data/exams/types";

interface ExamCardProps {
  id: number;
  title: string;
  type: "exam" | "test" | "assignment";
  duration: string;
  startTime: string;
  endTime: string;
  dueDate: string;
  className?: string;
  questionsCount?: number;
  isEnrolled?: boolean;
}

const ExamCard: React.FC<ExamCardProps> = ({
  id,
  title,
  type,
  duration,
  startTime,
  endTime,
  dueDate,
  className,
  questionsCount = 0,
  isEnrolled = true,
}) => {
  const navigate = useNavigate();

  // Use the centralized status determination logic
  const exam: Exam = {
    id,
    title,
    type,
    description: "",
    classId: 0,
    className: className || "",
    dueDate,
    startTime,
    endTime,
    durationHours: 0,
    durationMinutes: 0,
    duration,
    questions: []
  };

  const status = getExamStatus(exam, isEnrolled);
  const statusInfo = getStatusInfo(status);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDuration = (duration: string) => {
    // Extract hours and minutes from duration string
    const hours = duration.toLowerCase().includes('hour') ? 
      parseInt(duration.match(/(\d+)\s*hours?/)?.[1] || '0') : 0;
    const minutes = duration.toLowerCase().includes('minute') ? 
      parseInt(duration.match(/(\d+)\s*minutes?/)?.[1] || '0') : 0;

    if (hours > 0 && minutes > 0) {
      return `${hours}H ${minutes}M`;
    } else if (hours > 0) {
      return `${hours}H`;
    } else {
      return `${minutes}M`;
    }
  };

  const handleCardClick = () => {
    const isLecturerPath = window.location.pathname.includes('/user/l/');
    const basePath = isLecturerPath ? '/user/l/exams/details/' : '/user/s/exams/details/';
    navigate(`${basePath}${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h3 className="text-lg font-semibold text-slate-800 mb-1 truncate">{title}</h3>
          {className && (
            <p className="text-sm text-slate-600 truncate">{className}</p>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="flex jusitify-between">
        <div className="flex items-center gap-2 w-1/2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <FiCalendar className="text-blue-500 w-4 h-4" />
          </div>
          <p className="text-sm text-slate-700 whitespace-nowrap">{formatDate(dueDate)}</p>
        </div>
        <div className="flex w-1/2 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <FiClock className="text-purple-500 w-4 h-4" />
            </div>
            <p className="text-sm text-slate-700 truncate">{formatDuration(duration)}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <FiHelpCircle className="text-emerald-500 w-4 h-4" />
            </div>
            <p className="text-sm text-slate-700 truncate">{questionsCount} Q's</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;