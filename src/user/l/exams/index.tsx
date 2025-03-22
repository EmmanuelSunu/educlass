import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";
import { exams, type Exam } from "../../../data";
import ExamCard from "../../../components/examCard";

const Exams = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [examsList, setExamsList] = useState<Exam[]>([]);
  const itemsPerPage = 6;

  useEffect(() => {
    setExamsList(exams);
    setLoading(false);
  }, []);

  const handleAddExam = () => {
    navigate("/user/l/exams/create");
  };

  // Calculate pagination
  const totalPages = Math.ceil(examsList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = examsList.slice(startIndex, endIndex);

  return (
    <DashboardLayout
      title="Exams"
      showAddHeadbarButton={true}
      onAddHeadbarButton={handleAddExam}
      buttonTitle="Add Exam"
    >
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : examsList.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            No Exams Created
          </h3>
          <p className="text-slate-600 mb-6">
            Get started by creating your first exam.
          </p>
          <button
            onClick={handleAddExam}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Create Exam
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentExams.map((exam) => (
              <ExamCard
                key={exam.id}
                id={exam.id}
                title={exam.title}
                type="exam"
                duration={exam.duration}
                startTime={exam.startTime}
                endTime={exam.endTime}
                dueDate={exam.dueDate}
                className={exam.className}
                questionsCount={exam.questions.length}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Exams; 