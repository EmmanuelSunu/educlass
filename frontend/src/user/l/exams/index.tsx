import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";
import { type Exam } from "../../../data/exams/types";
import { getExams } from "../../../data/exams/service";
import ExamCard from "../../../components/examCard";

const ExamList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "exam" | "assignment">("all");
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const loadExams = async () => {
      const examData = getExams();
      setExams(examData);
      setLoading(false);
    };
    loadExams();
  }, []);

  const filteredExams = exams.filter(exam => 
    filter === "all" ? true : exam.type === filter
  );

  if (loading) {
    return (
      <DashboardLayout 
        title="Exams" 
        buttonTitle="Create Exam"
        showAddHeadbarButton={true}
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Exams"
      buttonTitle="Create Exam"
      showAddHeadbarButton={true}
      onAddHeadbarButton={() => navigate("/user/l/exams/create")}
    >
      {/* Filter */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              filter === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === "exam"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("exam")}
          >
            Exams
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === "assignment"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("assignment")}
          >
            Assignments
          </button>
        </div>
      </div>

      {/* Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredExams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ExamList; 