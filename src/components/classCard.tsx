import React, { useEffect, useState } from "react";

interface ClassCardProps {
  classId: string;
  level: string;
  program: string;
  totalStudents: number;
  className?: string;
}

const ClassCard: React.FC<ClassCardProps> = ({
  classId,
  level,
  program,
  totalStudents,
  className = "",
}) => {
  return (
    <div
      className={`border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex justify-between items-center">
        <h5 className="text-lg font-bold text-dark">Class ID: {classId}</h5>
        <span className="text-sm text-gray-600">Level: {level}</span>
      </div>
      <div className="mt-2 text-sm text-gray-700">
        <p>Program: {program}</p>
        <p>Total Students: {totalStudents}</p>
      </div>
    </div>
  );
};

export default ClassCard;
