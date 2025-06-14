import { useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiHelpCircle } from "react-icons/fi";
import { type Exam } from "../data/exams/types";
import { getExamStatus, getStatusInfo } from "../utils/examStatus";
import { formatDate } from "../utils/date";
import { formatDuration } from "../utils/time";

interface ExamCardProps {
  exam: Exam;
}

export default function ExamCard({ exam }: ExamCardProps) {
  const navigate = useNavigate();
  const status = getExamStatus(exam);
  const statusInfo = getStatusInfo(status);

  const handleCardClick = () => {
    const isLecturerPath = window.location.pathname.includes('/user/l/');
    const basePath = isLecturerPath ? '/user/l/exams/details/' : '/user/s/exams/details/';
    navigate(`${basePath}${exam.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h3 className="text-lg font-semibold text-slate-800 mb-1 truncate">{exam.title}</h3>
          {exam.className && (
            <p className="text-sm text-slate-600 truncate">{exam.className}</p>
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
          <p className="text-sm text-slate-700 whitespace-nowrap">{formatDate(exam.dueDate)}</p>
        </div>
        <div className="flex w-1/2 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <FiClock className="text-purple-500 w-4 h-4" />
            </div>
            <p className="text-sm text-slate-700 truncate">{formatDuration(exam.duration)}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <FiHelpCircle className="text-emerald-500 w-4 h-4" />
            </div>
            <p className="text-sm text-slate-700 truncate">{exam.questions.length} Q's</p>
          </div>
        </div>
      </div>
    </div>
  );
}