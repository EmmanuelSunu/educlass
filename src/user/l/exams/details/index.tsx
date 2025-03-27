import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/index";
import { type Exam } from "../../../../data/exams/types";
import { getExamById } from "../../../../data/exams/service";
import { FiCalendar, FiClock, FiUsers, FiEdit3, FiTrash2 } from "react-icons/fi";
import { getExamStatus, getStatusInfo } from "../../../../utils/examStatus";

const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundExam = getExamById(Number(id));
      setExam(foundExam || null);
      setLoading(false);
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/user/l/exams/create/${id}`);
  };

  const handleDelete = () => {
    // Implement delete functionality
    navigate("/user/l/exams");
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Loading..."
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!exam) {
    return (
      <DashboardLayout
        title="Exam Not Found"
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            Exam Not Found
          </h3>
          <p className="text-slate-600 mb-6">
            The exam you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/user/l/exams")}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Back to Exams
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const status = getExamStatus(exam, exam.id === 1);
  const statusInfo = getStatusInfo(status);

  return (
    <DashboardLayout title={exam.title} showAddHeadbarButton={false} buttonTitle="">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-800">
                  {exam.title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-slate-600">{exam.className}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                <FiEdit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiCalendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Due Date</p>
                <p className="text-slate-800">
                  {new Date(exam.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiClock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Duration</p>
                <p className="text-slate-800">{exam.duration}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiUsers className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Questions</p>
                <p className="text-slate-800">
                  {exam.questions?.length || 0} Questions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Description
          </h2>
          <p className="text-slate-600 whitespace-pre-wrap">
            {exam.description}
          </p>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Questions
          </h2>
          <div className="space-y-6">
            {exam.questions?.map((question, index) => (
              <div
                key={question.id}
                className="border border-slate-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-slate-800">
                    Question {index + 1}
                  </h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {question.points} points
                  </span>
                </div>
                <p className="text-slate-600 mb-3">{question.questionText}</p>
                {question.type === "multi-choice" && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded ${
                          option === question.questionAnswer
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExamDetails;