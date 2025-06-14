import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/index";
import { type Exam } from "../../../../data/exams/types";
import { getExamById } from "../../../../data/exams/service";
import { FiCalendar, FiClock, FiHelpCircle, FiBookOpen, FiInfo } from "react-icons/fi";
import { getExamStatus, getStatusInfo, type ExamStatus } from "../../../../utils/examStatus";

function ExamDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [examStatus, setExamStatus] = useState<ExamStatus>("past");

  useEffect(() => {
    if (id) {
      const exam = getExamById(Number(id));
      if (exam) {
        setExamDetails(exam);
        const status = getExamStatus(exam);
        setExamStatus(status);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout title="Loading Exam Details..." showAddHeadbarButton={false} buttonTitle="">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!examDetails) {
    return (
      <DashboardLayout title="Exam Not Found" showAddHeadbarButton={false} buttonTitle="">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <p className="text-center text-slate-700">
            The exam you're looking for could not be found.
          </p>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate("/user/s/exams")}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
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
    navigate(`/user/s/results/${examDetails.id}`);
  };

  const statusInfo = getStatusInfo(examStatus);

  return (
    <DashboardLayout
      title={examDetails.title}
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-800">{examDetails.title}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <FiBookOpen className="text-slate-400" />
                <span>{examDetails.className}</span>
              </div>
            </div>
            <div>
              {examStatus === "past" ? (
                <button
                  onClick={handleViewResults}
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  View Results
                </button>
              ) : examStatus === "available" && (
                <button
                  onClick={handleTakeExam}
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  Take Exam
                </button>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <FiCalendar className="text-blue-500 text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Due Date</p>
                <p className="text-slate-800">{new Date(examDetails.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <FiClock className="text-purple-500 text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Duration</p>
                <p className="text-slate-800">{examDetails.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <FiHelpCircle className="text-emerald-500 text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Questions</p>
                <p className="text-slate-800">{examDetails.questions.length} Questions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Instructions Card */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FiBookOpen className="text-primary" />
              Description
            </h2>
            <p className="text-slate-600 whitespace-pre-wrap">{examDetails.description}</p>
          </div>

          {examStatus === "available" && (
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <FiInfo className="text-primary text-lg" />
                <h2 className="text-lg font-semibold text-slate-800">Exam Instructions</h2>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-6">
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <div className="min-w-[8px] h-[8px] mt-[6px] rounded-full bg-blue-500" />
                    <span>This exam contains {examDetails.questions.length} questions worth a total of {examDetails.questions.reduce((sum, q) => sum + q.points, 0)} points.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="min-w-[8px] h-[8px] mt-[6px] rounded-full bg-blue-500" />
                    <span>You have {examDetails.duration} to complete this exam.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="min-w-[8px] h-[8px] mt-[6px] rounded-full bg-blue-500" />
                    <span>Once you start the exam, the timer cannot be paused.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="min-w-[8px] h-[8px] mt-[6px] rounded-full bg-blue-500" />
                    <span>Your answers are automatically saved as you progress.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="min-w-[8px] h-[8px] mt-[6px] rounded-full bg-blue-500" />
                    <span>You cannot return to change your answers once submitted.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="min-w-[8px] h-[8px] mt-[6px] rounded-full bg-blue-500" />
                    <span>The exam will automatically submit when the time expires.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="min-w-[8px] h-[8px] mt-[6px] rounded-full bg-blue-500" />
                    <span>Ensure you have a stable internet connection before starting.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ExamDetailsPage;
