// pages/Exams.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  className?: string; 
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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    title: "",
    type: "exam",
    duration: "2 hours",
    startTime: "",
    endTime: "",
    status: "scheduled",
    dueDate: ""
  });

  const navigate = useNavigate();

  const handleAddHeadbarButton = () => {
    navigate('/user/l/exams/create');
  };

  const handleAddExam = () => {
    if (newExam.title && newExam.dueDate) {
      const newExamWithId = {
        ...newExam,
        id: exams.length > 0 ? Math.max(...exams.map(exam => exam.id)) + 1 : 1
      } as Exam;

      setExams([...exams, newExamWithId]);
      setIsAddModalOpen(false);
      setNewExam({
        title: "",
        type: "exam",
        duration: "2 hours",
        startTime: "",
        endTime: "",
        status: "scheduled",
        dueDate: ""
      });
    }
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

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <span className="bg-purple-100 text-purple-600 text-xs px-2.5 py-0.5 rounded-full">Scheduled</span>;
      case 'in-progress':
      case 'available':
        return <span className="bg-blue-100 text-blue-600 text-xs px-2.5 py-0.5 rounded-full">Available</span>;
      case 'completed':
        return <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5 rounded-full">Unavailable</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <DashboardLayout
      title="Exams"
      showAddHeadbarButton={true}
      onAddHeadbarButton={handleAddHeadbarButton}
      buttonTitle="Add Exams"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentExams.map((exam) => (
          <ExamCard
            key={exam.id}
            id={exam.id}
            title={exam.title}
            type={exam.type}
            duration={exam.duration}
            startTime={exam.startTime}
            endTime={exam.endTime}
            status={exam.status}
            dueDate={exam.dueDate}
            className={exam.className}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 text-slate-700 text-sm font-medium transition-colors duration-200"
        >
          Previous
        </button>
        <span className="text-sm font-medium text-slate-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 text-slate-700 text-sm font-medium transition-colors duration-200"
        >
          Next
        </button>
      </div>

      {/* Add Exam Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Add New Exam</h2>

            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-span text-dark font-medium pb-2">Title</label>
                <input 
                  type="text"
                  className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
                  value={newExam.title}
                  onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                  placeholder="Exam title"
                />
              </div>

              <div className="mb-4">
                <label className="block text-span text-dark font-medium pb-2">Type</label>
                <select 
                  className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
                  value={newExam.type}
                  onChange={(e) => setNewExam({...newExam, type: e.target.value as 'exam' | 'test' | 'assignment'})}
                >
                  <option value="exam">Exam</option>
                  <option value="test">Test</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-span text-dark font-medium pb-2">Duration</label>
                <input 
                  type="text"
                  className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
                  value={newExam.duration}
                  onChange={(e) => setNewExam({...newExam, duration: e.target.value})}
                  placeholder="e.g. 2 hours"
                />
              </div>

              <div className="mb-4">
                <label className="block text-span text-dark font-medium pb-2">Due Date</label>
                <input 
                  type="date"
                  className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
                  value={newExam.dueDate}
                  onChange={(e) => setNewExam({...newExam, dueDate: e.target.value})}
                />
              </div>

              <div className="mb-4">
                <label className="block text-span text-dark font-medium pb-2">Start Time</label>
                <input 
                  type="time"
                  className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
                  value={newExam.startTime}
                  onChange={(e) => setNewExam({...newExam, startTime: e.target.value})}
                />
              </div>

              <div className="mb-4">
                <label className="block text-span text-dark font-medium pb-2">End Time</label>
                <input 
                  type="time"
                  className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
                  value={newExam.endTime}
                  onChange={(e) => setNewExam({...newExam, endTime: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                onClick={handleAddExam}
              >
                Add Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Exams;