// pages/Exams.tsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout";
import ExamCard from "../../../components/examCard";
import examsData from "./data/exams.json";

interface Exam {
  id: number;
  title: string;
  type: 'exam' | 'test' | 'assignment';
  duration: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  dueDate: string;
}

function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 12; // Number of exams to show per page

  useEffect(() => {
    // Fetch exams data from local JSON file
    const fetchExams = async () => {
      setExams(examsData as Exam[]);
    };

    fetchExams();
  }, []);

  const handleAddHeadbarButton = () => {
    console.log("Add exam clicked");
    // Add logic to add a new exam
  };

  // Pagination logic
  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = exams.slice(indexOfFirstExam, indexOfLastExam);

  const totalPages = Math.ceil(exams.length / examsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <DashboardLayout
      title="Exams"
      showAddHeadbarButton={true}
      onAddHeadbarButton={handleAddHeadbarButton}
      buttonTitle="Add Exams"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentExams.map((exam) => (
          <ExamCard
            id={exam.id}
            title={exam.title}
            type={exam.type}
            duration={exam.duration}
            startTime={exam.startTime}
            endTime={exam.endTime}
            status={exam.status}
            dueDate={exam.dueDate}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </DashboardLayout>
  );
}

export default Exams;
