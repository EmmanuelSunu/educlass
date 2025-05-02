import React from "react";
import { FiCalendar, FiUser } from "react-icons/fi";

interface ClassCardProps {
  code: string;
  name: string;
  level: string;
  status?: "Active" | "Inactive";
  semester: string;
  instructorId: string;
  description: string;
  className?: string;
}

const ClassCard: React.FC<ClassCardProps> = ({
  code,
  name,
  level,
  status = "Active",
  semester,
  instructorId,
  description,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      <h2 className="text-xl font-semibold text-slate-900 mb-3">{name}</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-[#ECFDF3] text-[#027A48] rounded-full text-sm font-medium">
          {code}
        </span>
        <span className="px-3 py-1 bg-[#EEF4FF] text-[#3538CD] rounded-full text-sm font-medium">
          Level {level}
        </span>
        <span className="px-3 py-1 bg-[#ECFDF3] text-[#027A48] rounded-full text-sm font-medium">
          {status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-slate-600">
          <FiCalendar className="w-4 h-4 mr-2 text-slate-400" />
          <span className="text-sm font-medium">{semester} Semester</span>
        </div>
        <div className="flex items-center text-slate-600">
          <FiUser className="w-4 h-4 mr-2 text-slate-400" />
          <span className="text-sm font-medium">Instructor ID: {instructorId}</span>
        </div>
      </div>

      <p className="text-base text-slate-600 line-clamp-2">{description}</p>
    </div>
  );
};

export default ClassCard;
