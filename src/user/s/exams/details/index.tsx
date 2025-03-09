import { useEffect, useState } from "react";
import DashboardLayout from "../../layout";
import { useNavigate, useParams } from "react-router-dom";
import examsData from "../../../l/exams/data/exams.json";

// Define the Exam interface to match the JSON structure
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
    questionText: string; // Use `questionText` instead of `text`
    options?: string[]; // `options` is optional
    questionAnswer: string;
  }>;
}

function ExamDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasTakenExam, setHasTakenExam] = useState(false); // Added state to track exam participation

  useEffect(() => {
    // Type assertion for the imported JSON data
    const typedExamsData = examsData as Exam[];

    console.log("Looking for exam with ID:", id);
    const exam = typedExamsData.find(exam => exam.id === Number(id));
    console.log("Found exam:", exam);

    if (exam) {
      setExamDetails(exam);

      // Check if exam is available based on date and time
      const now = new Date();
      const examDate = new Date(exam.dueDate);

      // Check if current date matches exam date
      const isSameDate = 
        now.getFullYear() === examDate.getFullYear() && 
        now.getMonth() === examDate.getMonth() && 
        now.getDate() === examDate.getDate();

      if (!isSameDate) {
        console.log("Exam date doesn't match current date", {
          examDate: exam.dueDate,
          currentDate: now.toISOString().split('T')[0]
        });
        setIsAvailable(false);
        return;
      }

      // If dates match, check if current time is within exam time window
      const [startHour, startMinute] = exam.startTime.split(':').map(Number);
      const [endHour, endMinute] = exam.endTime.split(':').map(Number);

      const startTimeMinutes = startHour * 60 + startMinute;
      const endTimeMinutes = endHour * 60 + endMinute;
      const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

      setIsAvailable(currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes);

      console.log("Time availability check:", {
        currentTime: `${now.getHours()}:${now.getMinutes()}`,
        startTime: exam.startTime,
        endTime: exam.endTime,
        isAvailable: currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes
      });
    }

    setLoading(false);
  }, [id]);

  // Helper function to check if two dates are the same day
  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleTakeExam = () => {
    navigate(`/user/s/exams/take/${id}`);
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Loading..."
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!examDetails) {
    return (
      <DashboardLayout
        title="Exam Not Found"
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-slate-700">The exam you're looking for could not be found.</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate('/user/s/exams')}
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded"
            >
              Back to Exams
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title={`Exam: ${examDetails.title}`}
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{examDetails.title}</h2>
            <p className="text-slate-600">{examDetails.className}</p>
          </div>
          <div className="mt-4 md:mt-0">
            {(() => {
            const now = new Date();
            const examDate = new Date(examDetails.dueDate);
            const isPastExam = examDate < now && !isSameDate(examDate, now);
            const isFutureExam = examDate > now && !isSameDate(examDate, now);

            if (isPastExam) {
              return (
                <button
                  onClick={() => navigate(`/user/s/exams/results/${id}`)}
                  className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Results
                </button>
              );
            } else if (isFutureExam) {
              return (
                <button
                  disabled
                  className="px-5 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed"
                >
                  Exam Not Yet Available
                </button>
              );
            } else if (isAvailable) {
              return (
                <button
                  onClick={handleTakeExam}
                  className="px-5 py-2 bg-primary text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Take Exam
                </button>
              );
            } else {
              return (
                <div className="text-red-500 font-medium">
                  This exam is not currently available.
                </div>
              );
            }
          })()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">Exam Details</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-slate-600">Type:</span>
                <span className="font-medium text-slate-800 capitalize">{examDetails.type}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-600">Duration:</span>
                <span className="font-medium text-slate-800">{examDetails.duration}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-600">Date:</span>
                <span className="font-medium text-slate-800">{new Date(examDetails.dueDate).toLocaleDateString()}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-600">Time Window:</span>
                <span className="font-medium text-slate-800">{examDetails.startTime} - {examDetails.endTime}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-600">Questions:</span>
                <span className="font-medium text-slate-800">{examDetails.questions ? examDetails.questions.length : 0}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">Instructions</h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Ensure you have a stable internet connection before starting.</li>
              <li>Once started, the exam timer cannot be paused.</li>
              <li>You can navigate between questions during the exam.</li>
              <li>Your answers are automatically saved as you proceed.</li>
              <li>Submit your exam before the time expires.</li>
            </ul>
          </div>
        </div>

        {/* Exam Description Section */}
        {examDetails.description && (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
            <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
            <p className="text-slate-700">{examDetails.description}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ExamDetailsPage;