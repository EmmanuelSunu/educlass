import { FiAward, FiClock, FiChevronRight } from "react-icons/fi";

interface ResultCardProps {
  id: number;
  examTitle: string;
  className: string;
  score: number;
  totalPoints: number;
  completionTime: string;
  submittedDate: string;
  grade: string;
  onClick?: (id: number) => void;
}

function calculateGradeColor(grade: string): string {
  switch (grade.toUpperCase()) {
    case 'A':
      return 'text-emerald-600 bg-emerald-50';
    case 'B':
      return 'text-blue-600 bg-blue-50';
    case 'C':
      return 'text-purple-600 bg-purple-50';
    case 'D':
      return 'text-amber-600 bg-amber-50';
    case 'E':
      return 'text-orange-600 bg-orange-50';
    case 'F':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-slate-600 bg-slate-50';
  }
}

function calculateScoreColor(score: number, total: number): string {
  const percentage = (score / total) * 100;
  if (percentage >= 80) return 'text-emerald-600';
  if (percentage >= 70) return 'text-blue-600';
  if (percentage >= 60) return 'text-purple-600';
  if (percentage >= 50) return 'text-amber-600';
  return 'text-red-600';
}

export default function ResultCard({
  id,
  examTitle,
  className,
  score,
  totalPoints,
  completionTime,
  grade,
  onClick
}: ResultCardProps) {
  const scorePercentage = (score / totalPoints) * 100;
  const gradeColorClass = calculateGradeColor(grade);
  const scoreColorClass = calculateScoreColor(score, totalPoints);

  return (
    <div 
      onClick={() => onClick?.(id)}
      className="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="p-6">
        {/* Header with Grade */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-primary transition-colors">{examTitle}</h3>
            <p className="text-sm text-slate-600">{className}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-lg font-bold ${gradeColorClass}`}>
              {grade.toUpperCase()}
            </div>
            <FiChevronRight className="text-slate-400 group-hover:text-primary transition-colors" />
          </div>
        </div>

        {/* Score and Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiAward className={`text-2xl ${scoreColorClass}`} />
            <div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold ${scoreColorClass}`}>{scorePercentage.toFixed(1)}%</span>
              </div>
              <p className="text-sm text-slate-500">Score</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <FiClock className="text-lg" />
            <span className="text-sm">{completionTime}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                scorePercentage >= 80 ? 'bg-emerald-500' :
                scorePercentage >= 70 ? 'bg-blue-500' :
                scorePercentage >= 60 ? 'bg-purple-500' :
                scorePercentage >= 50 ? 'bg-amber-500' :
                'bg-red-500'
              }`}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 