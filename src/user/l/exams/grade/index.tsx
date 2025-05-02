import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/index";
import { type Exam } from "../../../../data/exams/types";
import { getExamById } from "../../../../data/exams/service";
import { getSubmissionsForExam, updateSubmission, type StudentSubmission } from "../../../../data/exams/submissions";
import { FiCheck, FiX } from "react-icons/fi";

const GradeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<Exam | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);

  useEffect(() => {
    if (id) {
      const foundExam = getExamById(Number(id));
      if (foundExam) {
        setExam(foundExam);
        const examSubmissions = getSubmissionsForExam(Number(id));
        setSubmissions(examSubmissions);
      } else {
        navigate("/user/l/exams");
      }
    }
    setLoading(false);
  }, [id, navigate]);

  const handleScoreChange = (questionId: string, score: number) => {
    if (!selectedSubmission) return;

    setSelectedSubmission((prev) => {
      if (!prev) return prev;

      const updatedAnswers = prev.answers.map((a) =>
        a.questionId === questionId ? { ...a, score } : a
      );

      const totalScore = updatedAnswers.reduce((sum, a) => sum + a.score, 0);

      return {
        ...prev,
        answers: updatedAnswers,
        totalScore,
      };
    });
  };

  const handleFeedbackChange = (questionId: string, feedback: string) => {
    if (!selectedSubmission) return;

    setSelectedSubmission((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        answers: prev.answers.map((a) =>
          a.questionId === questionId ? { ...a, feedback } : a
        ),
      };
    });
  };

  const handleSaveGrades = () => {
    if (!selectedSubmission) return;

    const updatedSubmission = {
      ...selectedSubmission,
      status: "graded" as const,
    };

    updateSubmission(updatedSubmission);
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === selectedSubmission.id ? updatedSubmission : s
      )
    );

    setSelectedSubmission(null);
  };

  if (loading || !exam) {
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

  return (
    <DashboardLayout
      title={`Grade: ${exam.title}`}
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                Student Submissions
              </h2>
            </div>
            <div className="divide-y divide-slate-200">
              {submissions.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                    selectedSubmission?.id === submission.id
                      ? "bg-slate-50"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-slate-800">
                        {submission.studentName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Submitted:{" "}
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`flex items-center ${
                        submission.status === "graded"
                          ? "text-green-500"
                          : "text-amber-500"
                      }`}
                    >
                      {submission.status === "graded" ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        <FiX className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grading Area */}
        {selectedSubmission ? (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-800">
                    {selectedSubmission.studentName}'s Submission
                  </h2>
                  <div className="text-sm text-slate-500">
                    Total Score: {selectedSubmission.totalScore} /{" "}
                    {exam.questions.reduce((sum, q) => sum + q.points, 0)}
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-8">
                {exam.questions.map((question, index) => {
                  const answer = selectedSubmission.answers.find(
                    (a) => a.questionId === question.id
                  );
                  if (!answer) return null;

                  return (
                    <div key={question.id} className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-slate-800">
                            Question {index + 1}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            {question.questionText}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-600">Score:</span>
                          <input
                            type="number"
                            min="0"
                            max={question.points}
                            value={answer.score}
                            onChange={(e) =>
                              handleScoreChange(
                                question.id,
                                Math.min(
                                  question.points,
                                  Math.max(0, parseInt(e.target.value) || 0)
                                )
                              )
                            }
                            className="w-20 px-2 py-1 border border-slate-300 rounded-md text-sm"
                          />
                          <span className="text-sm text-slate-600">
                            / {question.points}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-md p-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-2">
                          Student's Answer:
                        </h4>
                        <p className="text-slate-600">{answer.answer}</p>
                      </div>

                      {question.type !== "multi-choice" && (
                        <div className="bg-slate-50 rounded-md p-4">
                          <h4 className="text-sm font-medium text-slate-700 mb-2">
                            Model Answer:
                          </h4>
                          <p className="text-slate-600">
                            {question.questionAnswer}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Feedback
                        </label>
                        <textarea
                          value={answer.feedback}
                          onChange={(e) =>
                            handleFeedbackChange(question.id, e.target.value)
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Provide feedback for the student..."
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t border-slate-200">
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveGrades}
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Save Grades
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="text-center text-slate-600">
                Select a submission to start grading
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GradeExam; 