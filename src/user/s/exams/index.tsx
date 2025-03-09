import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";
import examsData from "../../l/exams/data/exams.json";
import { FiCalendar, FiClock } from "react-icons/fi";

// Define interfaces for TypeScript
interface Exam {
  id: number;
  title: string;
  type: string;
  duration: string;
  durationHours: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  status: string;
  dueDate: string;
  description: string;
  classId: number;
  className: string;
  questions: Array<{
    id: string;
    type: string;
    questionText: string;
    options?: string[];
    questionAnswer: string;
  }>;
}

// Mock data for student classes
const studentClassIds = [1, 2, 3, 5]; // Classes the student is enrolled in

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function StudentExams() {
  const navigate = useNavigate();
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Type assertion for exams data
    const typedExamsData = examsData as Exam[];
    
    // Filter exams to only show those from classes the student is enrolled in
    const studentExams = typedExamsData.filter(exam => 
      studentClassIds.includes(exam.classId)
    );

    // Update today's date for all exams to ensure availability
    const today = new Date();
    const updatedExams = studentExams.map(exam => ({
      ...exam,
      dueDate: today.toISOString().split('T')[0] // Set due date to today for demo purposes
    }));

    setAvailableExams(updatedExams);
    setLoading(false);
  }, []);

  const handleExamClick = (exam: Exam) => {
    console.log("Navigating to exam details:", exam.id);
    navigate(`/user/s/exams/details/${exam.id}`);
  };

  const getExamStatusLabel = (exam: Exam): { label: string; color: string } => {
    const now = new Date();
    const dueDate = new Date(`${exam.dueDate} ${exam.endTime}`);

    if (now > dueDate) {
      return { label: "Completed", color: "bg-green-100 text-green-800" };
    } else {
      return { label: "Available", color: "bg-blue-100 text-blue-800" };
    }
  };

  return (
    <DashboardLayout
      title="My Exams"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Available Exams</h2>
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
        <div className="grid grid-cols-1 gap-4">
          {availableExams.map((exam) => {
            const statusInfo = getExamStatusLabel(exam);

            return (
              <div
                key={exam.id}
                onClick={() => handleExamClick(exam)}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-800">
                    {exam.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  {exam.className}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCalendar className="mr-2" />
                    <span>Due: {formatDate(exam.dueDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiClock className="mr-2" />
                    <span>{exam.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default StudentExams;