import { useEffect, useState } from "react";
import DashboardLayout from "../layout";
import { type Exam } from "../../../data/exams/types";
import { getExamsByStudentClassIds } from "../../../data/exams/service";
import ExamCard from "../../../components/examCard";

function StudentExams() {
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual student class IDs from user context
    const studentClassIds = [1, 2];
    const studentExams = getExamsByStudentClassIds(studentClassIds);
    setAvailableExams(studentExams);
    setLoading(false);
  }, []);

  return (
    <DashboardLayout
      title="My Exams"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-2">
          Available Exams
        </h2>
        <p className="text-sm text-gray-600">
          View and take exams from your enrolled classes
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-600">Loading exams...</div>
        </div>
      ) : availableExams.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">No exams available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default StudentExams;
