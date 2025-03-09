
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import examsData from "../../../l/exams/data/exams.json";
import { Exam } from "../../../l/exams/types";

// Helper function to check if two dates are the same day
function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function ExamDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasTakenExam, setHasTakenExam] = useState(false);
  const [isPastExam, setIsPastExam] = useState(false);
  const [isFutureExam, setIsFutureExam] = useState(false);

  useEffect(() => {
    // Type assertion for the imported JSON data
    const typedExamsData = examsData as Exam[];

    console.log("Looking for exam with ID:", id);
    const exam = typedExamsData.find(exam => exam.id === Number(id));
    console.log("Found exam:", exam);

    if (exam) {
      setExamDetails(exam);
      setLoading(false);

      // Check exam date against current date
      const now = new Date();
      const examDate = new Date(exam.dueDate);

      // Check if exam is in the past, present, or future
      if (examDate < now && !isSameDate(examDate, now)) {
        setIsPastExam(true);
        // For demo purposes, randomly decide if student participated
        setHasTakenExam(Math.random() > 0.5);
      } else if (examDate > now && !isSameDate(examDate, now)) {
        setIsFutureExam(true);
      } else {
        // If dates match, check if current time is within exam time window
        const [startHour, startMinute] = exam.startTime.split(':').map(Number);
        const [endHour, endMinute] = exam.endTime.split(':').map(Number);
        
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        const currentTimeValue = currentHour * 60 + currentMinute;
        const startTimeValue = startHour * 60 + startMinute;
        const endTimeValue = endHour * 60 + endMinute;
        
        const isTimeAvailable = currentTimeValue >= startTimeValue && currentTimeValue <= endTimeValue;
        
        console.log("Time availability check:", {
          currentTime: `${currentHour}:${currentMinute}`,
          startTime: exam.startTime,
          endTime: exam.endTime,
          isAvailable: isTimeAvailable
        });
        
        setIsAvailable(isTimeAvailable);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout
        title="Loading Exam Details..."
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

  const handleTakeExam = () => {
    navigate(`/user/s/exams/take/${examDetails.id}`);
  };

  const handleViewResults = () => {
    navigate(`/user/s/exams/results/${examDetails.id}`);
  };

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
            {isPastExam ? (
              // Past exam - show results or "did not participate" message
              hasTakenExam ? (
                <button
                  onClick={handleViewResults}
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded"
                >
                  View Results
                </button>
              ) : (
                <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded font-medium">
                  Did not participate
                </div>
              )
            ) : isFutureExam ? (
              // Future exam - show when it will be available
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded font-medium">
                Available on {new Date(examDetails.dueDate).toLocaleDateString()}
              </div>
            ) : (
              // Current day exam - enable or disable based on time window
              <button
                onClick={handleTakeExam}
                disabled={!isAvailable}
                className={`${
                  isAvailable
                    ? "bg-primary hover:bg-primary-dark text-white"
                    : "bg-gray-300 cursor-not-allowed text-gray-600"
                } font-medium py-2 px-4 rounded`}
              >
                {isAvailable ? "Take Exam" : "Not Available Yet"}
              </button>
            )}
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
            <h3 className="font-semibold text-slate-800 mb-2">Status</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-slate-600">Status:</span>
                <span className={`font-medium capitalize ${
                  isPastExam ? "text-gray-800" :
                  isFutureExam ? "text-blue-600" :
                  isAvailable ? "text-green-600" : "text-amber-600"
                }`}>
                  {isPastExam ? "Past" :
                   isFutureExam ? "Upcoming" :
                   isAvailable ? "Available Now" : "Not Available Yet"}
                </span>
              </li>
              {isPastExam && (
                <li className="flex justify-between">
                  <span className="text-slate-600">Participation:</span>
                  <span className={`font-medium ${hasTakenExam ? "text-green-600" : "text-red-600"}`}>
                    {hasTakenExam ? "Completed" : "Did Not Participate"}
                  </span>
                </li>
              )}
              {isFutureExam && (
                <li className="flex justify-between">
                  <span className="text-slate-600">Days until exam:</span>
                  <span className="font-medium text-slate-800">
                    {Math.ceil((new Date(examDetails.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-4 mt-6">
          <h3 className="font-semibold text-slate-800 mb-3">Description</h3>
          <div className="text-slate-700 whitespace-pre-wrap">
            {examDetails.description || "No description provided."}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ExamDetailsPage;
