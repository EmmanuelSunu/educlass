import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout";
import { useNavigate, useParams } from "react-router-dom";
import examsData from "../../../../user/s/exams/mock-data";

function ExamDetails() {
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

      const isTimeWithinWindow = currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes;

      console.log("Checking time availability", {
        startTime: `${startHour}:${startMinute}`,
        endTime: `${endHour}:${endMinute}`,
        currentTime: `${now.getHours()}:${now.getMinutes()}`,
        isWithinTimeWindow: isTimeWithinWindow
      });

      setIsAvailable(isTimeWithinWindow);
    } else {
      navigate('/user/s/exams');
    }
  }, [id, navigate]);

  const handleStartExam = () => {
    navigate(`/user/s/exams/take/${id}`);
  };

  if (!examDetails) {
    return (
      <DashboardLayout 
        title="Loading..." 
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-600">Loading...</div>
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
            {isAvailable ? (
              <button
                onClick={handleStartExam}
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded"
              >
                Start Exam
              </button>
            ) : (
              <button
                disabled
                className="bg-slate-300 text-slate-500 font-medium py-2 px-4 rounded cursor-not-allowed"
              >
                Not Available Now
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-700 font-medium">Type</p>
            <p className="text-slate-900 capitalize">{examDetails.type}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-700 font-medium">Duration</p>
            <p className="text-slate-900">{examDetails.duration}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-700 font-medium">Date</p>
            <p className="text-slate-900">{examDetails.dueDate}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-700 font-medium">Time</p>
            <p className="text-slate-900">{examDetails.startTime} - {examDetails.endTime}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-slate-800">Description</h3>
          <p className="text-slate-700">{examDetails.description}</p>
        </div>

        <div>
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

export default ExamDetails;