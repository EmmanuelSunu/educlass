import React from 'react';
import { RiEyeLine } from "react-icons/ri";

interface ExamCardProps {
  title: string;
  code: string;
  onView?: () => void;
  className?: string;
}

const ExamCard: React.FC<ExamCardProps> = ({
  title,
  code,
  onView,
  className = ''
}) => {
  return (
    <div 
      className={`
        hover:drop-shadow-md border-slate-100 rounded-md px-4 py-5 
        flex flex-col bg-white gap-5 transition-shadow duration-200
        ${className}
      `}
    >
      <h5 className="text-h5 text-dark">{title}</h5>
      <div className="flex flex-row justify-between items-center">
        <span className="text-h6 text-dark">{code}</span>
        <button 
          onClick={onView}
          className="text-xl text-slate-600 hover:text-primary transition-colors duration-200"
          aria-label={`View ${title} details`}
        >
          <RiEyeLine />
        </button>
      </div>
    </div>
  );
};

export default ExamCard;