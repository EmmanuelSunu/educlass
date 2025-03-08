import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout";
import { useNavigate, useParams } from "react-router-dom";
// Using the local mock data instead of importing

function ExamDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    console.log("Looking for exam with ID:", id);
    const exam = examsData.find(exam => exam.id === Number(id));
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

  const handleStartExam = () => {
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
      <div className="container mx-auto p-4 md:p-6"> {/* Added container for better centering */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"> {/* Improved spacing and responsiveness */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{examDetails.title}</h2>
          <div>
            {isAvailable ? (
              /* Added w-full for smaller screens */
              <button
                onClick={handleStartExam}
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded w-full sm:w-auto"
              >
                Start Exam
              </button>
            ) : (
              /* Added w-full for smaller screens */
              <button
                disabled
                className="bg-slate-300 text-slate-500 font-medium py-2 px-4 rounded cursor-not-allowed w-full sm:w-auto"
              >
                Not Available Now
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

        <div className="mb-4"> {/* Added for better spacing on smaller screens */}
          <h3 className="text-xl font-semibold mb-4 text-slate-800">Exam Questions Preview</h3>
          {examDetails.questions && examDetails.questions.length > 0 ? (
            <div className="space-y-4">
              {examDetails.questions.map((question, index) => (
                <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="font-medium text-slate-800 mb-2">Question {index + 1}</p>
                  <p className="text-slate-700">{question.text}</p>
                  {question.options && question.options.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-slate-500 italic mb-1">Options will be available during the exam</p>
                      <div className="pl-4">
                        {question.options.map((_, optionIndex) => (
                          <div key={optionIndex} className="h-4 w-24 bg-slate-200 rounded my-2"></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-lg text-slate-700">
              <p>This exam contains no questions yet.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ExamDetailsPage;

// Mock data for development
const examsData = [
  {
    id: 101,
    title: "Midterm Exam: Introduction to Computer Science",
    className: "CS101",
    type: "exam",
    duration: "90 minutes",
    dueDate: new Date().toISOString().split('T')[0], // Today's date for demo
    startTime: "09:00",
    endTime: "23:59",
    status: "scheduled",
    questions: [
      { text: "What is the difference between a compiler and an interpreter?", questionType: "essay", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
      { text: "Explain the concept of object-oriented programming.", questionType: "essay", options: [] },
      { text: "What are the advantages of using version control systems?", questionType: "objective", options: ["Option 1", "Option 2", "Option 3", "Option 4"] }
    ]
  },
  // Add more mock exams as needed
];