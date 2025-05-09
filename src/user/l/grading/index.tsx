import { useState, useEffect } from "react";
import DashboardLayout from "../layout";
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiCheck, 
  FiClock, 
  FiAlertCircle,
  FiDownload,
  FiSave,
  FiBook,
  FiCalendar,
  FiUsers
} from "react-icons/fi";
import Modal from "../../../components/Modal";
import { Exam } from "../../../data/exams/types";
import { getExams } from "../../../data/exams/service";

interface Question {
  id: string;
  text: string;
  type: "essay" | "multi-choice" | "fill-ins";
  points: number;
  submissions: Submission[];
  stats?: {
    averageScore: number;
    gradedCount: number;
    pendingCount: number;
    highestScore: number;
    lowestScore: number;
  };
}

interface Submission {
  id: string;
  studentId: string;
  answer: string;
  score: number;
  status: "graded" | "pending" | "in_progress";
  feedback: string;
  aiFeedback: string;
  manuallyGraded: boolean;
  lastModified: string;
  needsStatus?: "needs_attention" | "its_fine" | "not_processed";
}

interface OverrideModal {
  isOpen: boolean;
  submission: Submission | null;
  question: Question | null;
  selectedSubmissions?: Submission[];
}

const GradingPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [overrideModal, setOverrideModal] = useState<OverrideModal>({
    isOpen: false,
    submission: null,
    question: null,
    selectedSubmissions: []
  });
  const [pendingChanges, setPendingChanges] = useState<{
    [key: string]: {
      score: number;
      feedback: string;
    };
  }>({});
  const [filterStatus, setFilterStatus] = useState<"all" | "needs_attention" | "its_fine">("all");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const fetchedExams = getExams();
        setExams(fetchedExams);
        setQuestions([]);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleExamSelect = (exam: Exam) => {
    setSelectedExam(exam);
    console.log("Selected Exam:", JSON.parse(JSON.stringify(exam)));

    const gradingQuestions: Question[] = exam.questions
      .filter(q_exam => q_exam.type === "essay")
      .map(q_exam => {
      console.log(`Processing Question from exam.questions: id='${q_exam.id}', text='${q_exam.questionText}'`);

      const submissionsForThisQuestion: Submission[] = exam.submissions?.map(s_exam => {
        console.log(`  Processing Student Submission: studentId='${s_exam.studentId}', submissionId='${s_exam.id}'`);
        console.log(`    Looking for answer for questionId='${q_exam.id}' in student's answers:`, JSON.parse(JSON.stringify(s_exam.answers)));

        const foundAnswerEntry = s_exam.answers.find(a_exam => a_exam.questionId === q_exam.id);

        if (foundAnswerEntry) {
          console.log(`    FOUND answer entry for questionId='${q_exam.id}':`, JSON.parse(JSON.stringify(foundAnswerEntry)));
        } else {
          console.log(`    NOT FOUND answer entry for questionId='${q_exam.id}'`);
        }

        let submissionStatus: "graded" | "pending" | "in_progress" = "pending";
        if (s_exam.totalScore !== undefined) {
          submissionStatus = "graded";
        }

        return {
          id: s_exam.id.toString(),
          studentId: s_exam.studentId.toString(),
          answer: foundAnswerEntry?.answer || "",
          score: foundAnswerEntry?.score || 0,
          status: submissionStatus,
          feedback: "", 
          aiFeedback: "",
          manuallyGraded: false,
          lastModified: s_exam.submittedAt,
          needsStatus: "not_processed" as const,
        };
      }) || [];

      return {
        id: q_exam.id,
        text: q_exam.questionText,
        type: q_exam.type,
        points: q_exam.points,
        submissions: submissionsForThisQuestion
      };
    });
    
    console.log("Processed gradingQuestions for state:", JSON.parse(JSON.stringify(gradingQuestions)));
    setQuestions(gradingQuestions);
    setFilterStatus("all"); 
  };

  const handleBackToExams = () => {
    setSelectedExam(null);
    setQuestions([]);
  };

  const handleExportGrades = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const csvContent = [
      ["Student Index", "Status", "Score", "Feedback", "Last Modified", "Grading Type"].join(","),
      ...question.submissions.map(s => [
        s.studentId,
        s.status,
        s.score || "N/A",
        `"${s.feedback || ''}"`,
        s.lastModified || "N/A",
        s.manuallyGraded ? "Manual" : "AI"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${question.text}-Q${question.id}-grades.csv`;
    a.click();
  };

  const handleSaveBulkOverride = (questionId: string, submissions: Submission[], score: number, feedback: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          submissions: q.submissions.map(s => {
            if (submissions.find(sub => sub.id === s.id)) {
              return {
                ...s,
                score,
                feedback,
                status: "graded" as const,
                manuallyGraded: true,
                lastModified: new Date().toISOString()
              };
            }
            return s;
          })
        };
      }
      return q;
    }));
  };

  const handleAIGradeAll = async () => {
    if (!selectedExam) return;
    
    setLoading(true);
    try {
      const updatedQuestions = questions.map(question => ({
        ...question,
        submissions: question.submissions.map(submission => ({
          ...submission,
          score: Math.floor(Math.random() * question.points),
          status: "graded" as const,
          aiFeedback: `AI Feedback for ${question.text.substring(0, 30)}...`,
          feedback: "",
          manuallyGraded: false,
          lastModified: new Date().toISOString(),
          needsStatus: (Math.random() > 0.7 ? "needs_attention" : "its_fine") as "needs_attention" | "its_fine",
        }))
      }));
      
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Error in AI grading:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualOverride = (questionId: string, submissionId: string, score: number, feedback: string) => {
    const key = `${questionId}-${submissionId}`;
    setPendingChanges(prev => ({
      ...prev,
      [key]: { score, feedback }
    }));
  };

  const handleSaveOverride = (questionId: string, submissionId: string) => {
    const key = `${questionId}-${submissionId}`;
    const changes = pendingChanges[key];
    if (!changes) return;

    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          submissions: q.submissions.map(s => {
            if (s.id === submissionId) {
              return {
                ...s,
                score: changes.score,
                feedback: changes.feedback,
                status: "graded" as const,
                manuallyGraded: true,
                lastModified: new Date().toISOString(),
                needsStatus: "its_fine" as const,
              };
            }
            return s;
          })
        };
      }
      return q;
    }));

    setPendingChanges(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const handlePublishScores = () => {
    if (!selectedExam) return;
    console.log(`Publishing scores for exam: ${selectedExam.title}`);
    alert(`Scores for ${selectedExam.title} would be published now.`);
  };

  const filteredSubmissions = (submissions: Submission[]) => {
    if (filterStatus === "all") {
      return submissions;
    }
    return submissions.filter(s => s.needsStatus === filterStatus);
  };

  return (
    <DashboardLayout
      title="Grading"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : selectedExam ? (
        <div className="space-y-6 pb-6">
          {/* Back button and Exam Info */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToExams}
              className="flex items-center text-primary hover:text-primary-dark"
            >
              <FiChevronUp className="transform rotate-90 mr-2" />
              Back to Exams
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={handleAIGradeAll}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center gap-2"
              >
                <FiCheck className="w-4 h-4" />
                Grade All with AI
              </button>
              <button
                onClick={handlePublishScores}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Publish Scores
              </button>
            </div>
          </div>

          {/* Exam Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{selectedExam.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <FiBook className="mr-2" />
                  <span>{selectedExam.className}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2" />
                  <span>{new Date(selectedExam.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <FiClock className="mr-2" />
                  <span>{selectedExam.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiUsers className="mr-2" />
                  <span>{selectedExam.submissions?.length || 0} submissions</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Questions:</span>
                  <span className="font-medium">{selectedExam.questions.length}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Total Points:</span>
                  <span className="font-medium">
                    {selectedExam.questions.reduce((sum, q) => sum + q.points, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Question Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-slate-50"
                  onClick={() => setExpandedQuestion(
                    expandedQuestion === question.id ? null : question.id
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800">Question {index + 1}</h3>
                      <p className="text-slate-600 mt-1">{question.text}</p>
                      <p className="text-slate-600">Points: {question.points}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportGrades(question.id);
                        }}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-600"
                        title="Export grades"
                      >
                        <FiDownload className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-2 hover:bg-slate-100 rounded-full"
                      >
                        {expandedQuestion === question.id ? (
                          <FiChevronUp className="w-5 h-5 text-slate-600" />
                        ) : (
                          <FiChevronDown className="w-5 h-5 text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Stats Preview */}
                  {question.stats && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                      <div className="bg-slate-50 rounded-md p-3">
                        <div className="text-sm text-slate-600">Average Score</div>
                        <div className="text-lg font-semibold text-slate-800">
                          {question.stats.averageScore.toFixed(1)}/{question.points}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-md p-3">
                        <div className="text-sm text-slate-600">Progress</div>
                        <div className="text-lg font-semibold text-slate-800">
                          {question.stats.gradedCount}/{question.submissions.length} Graded
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-md p-3">
                        <div className="text-sm text-slate-600">Highest Score</div>
                        <div className="text-lg font-semibold text-slate-800">
                          {question.stats.highestScore}/{question.points}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-md p-3">
                        <div className="text-sm text-slate-600">Lowest Score</div>
                        <div className="text-lg font-semibold text-slate-800">
                          {question.stats.lowestScore}/{question.points}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Question Content */}
                {expandedQuestion === question.id && (
                  <div className="border-t border-slate-200">
                    <div className="p-6 space-y-6">
                      {/* Submissions */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-slate-800">Student Submissions</h4>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-600">Filter:</span>
                              <button 
                                onClick={() => setFilterStatus("all")} 
                                className={`px-3 py-1 text-sm rounded-md ${filterStatus === "all" ? "bg-primary text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}
                              >
                                All
                              </button>
                              <button 
                                onClick={() => setFilterStatus("needs_attention")} 
                                className={`px-3 py-1 text-sm rounded-md ${filterStatus === "needs_attention" ? "bg-yellow-500 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}
                              >
                                Needs Attention
                              </button>
                              <button 
                                onClick={() => setFilterStatus("its_fine")} 
                                className={`px-3 py-1 text-sm rounded-md ${filterStatus === "its_fine" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}
                              >
                                It's Fine
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                const updatedQuestions = questions.map(q => {
                                  if (q.id === question.id) {
                                    return {
                                      ...q,
                                      submissions: q.submissions.map(s => ({
                                        ...s,
                                        score: Math.floor(Math.random() * q.points),
                                        status: "graded" as const,
                                        aiFeedback: `AI Feedback for ${q.text.substring(0, 30)}...`,
                                        feedback: "",
                                        manuallyGraded: false,
                                        lastModified: new Date().toISOString(),
                                        needsStatus: (Math.random() > 0.7 ? "needs_attention" : "its_fine") as "needs_attention" | "its_fine",
                                      }))
                                    };
                                  }
                                  return q;
                                });
                                setQuestions(updatedQuestions);
                              }}
                              className="px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 flex items-center gap-2 text-sm"
                            >
                              <FiCheck className="w-4 h-4" />
                              Grade with AI
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {filteredSubmissions(question.submissions).map((submission) => (
                            <div key={submission.id} className="py-4 border-b border-slate-200 last:border-0">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-800">
                                    Student ID: {submission.studentId}
                                  </span>
                                  {submission.status === "graded" && (
                                    <span className={`flex items-center gap-1 text-sm ${submission.needsStatus === "needs_attention" ? "text-yellow-600" : "text-emerald-600"}`}>
                                      <FiCheck className="w-4 h-4" />
                                      Graded {submission.manuallyGraded && "(Manual)"}
                                      {submission.needsStatus === "needs_attention" && <FiAlertCircle title="Needs Attention" className="w-4 h-4" />}
                                    </span>
                                  )}
                                  {submission.status === "pending" && (
                                    <span className="flex items-center gap-1 text-sm text-slate-600">
                                      <FiAlertCircle className="w-4 h-4" />
                                      Pending
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {submission.score !== undefined && (
                                    <span className="text-sm font-medium text-slate-800">
                                      {submission.score}/{question.points}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Student Answer */}
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-slate-700 mb-2">Answer</h5>
                                <p className="text-slate-600 text-sm">{submission.answer}</p>
                              </div>

                              {/* AI Feedback */}
                              {submission.aiFeedback && (
                                <div className="mb-4">
                                  <h5 className="text-sm font-medium text-slate-700 mb-2">AI Feedback</h5>
                                  <p className="text-slate-600 text-sm bg-blue-50 p-3 rounded">
                                    {submission.aiFeedback}
                                  </p>
                                </div>
                              )}

                              {/* Manual Override */}
                              <div className="mt-4">
                                <h5 className="text-sm font-medium text-slate-700 mb-2">Manual Override</h5>
                                <div className="flex gap-4">
                                  <div className="flex-1">
                                    <label className="block text-sm text-slate-600 mb-1">Score (0-{question.points})</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max={question.points}
                                      value={pendingChanges[`${question.id}-${submission.id}`]?.score ?? submission.score ?? ""}
                                      placeholder="Enter score"
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20"
                                      onChange={(e) => {
                                        const score = parseInt(e.target.value);
                                        if (score >= 0 && score <= question.points) {
                                          handleManualOverride(
                                            question.id,
                                            submission.id,
                                            score,
                                            pendingChanges[`${question.id}-${submission.id}`]?.feedback ?? submission.feedback ?? ""
                                          );
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <label className="block text-sm text-slate-600 mb-1">Feedback</label>
                                    <textarea
                                      value={pendingChanges[`${question.id}-${submission.id}`]?.feedback ?? submission.feedback ?? ""}
                                      placeholder="Enter feedback for the student..."
                                      rows={3}
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20"
                                      onChange={(e) => {
                                        handleManualOverride(
                                          question.id,
                                          submission.id,
                                          pendingChanges[`${question.id}-${submission.id}`]?.score ?? submission.score ?? 0,
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                  <div className="text-sm text-slate-500">
                                    {submission.manuallyGraded ? (
                                      <span className="flex items-center gap-1 text-emerald-600">
                                        <FiCheck className="w-4 h-4" />
                                        Manually graded
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1 text-blue-600">
                                        <FiCheck className="w-4 h-4" />
                                        AI graded
                                      </span>
                                    )}
                                  </div>
                                  {pendingChanges[`${question.id}-${submission.id}`] && (
                                    <button
                                      onClick={() => handleSaveOverride(question.id, submission.id)}
                                      className="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center gap-2 text-sm"
                                    >
                                      <FiSave className="w-4 h-4" />
                                      Save Changes
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                onClick={() => handleExamSelect(exam)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{exam.description}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {exam.type}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCalendar className="mr-2" />
                    <span>{new Date(exam.dueDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <FiClock className="mr-2" />
                    <span>{exam.duration}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <FiBook className="mr-2" />
                    <span>{exam.className}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <FiUsers className="mr-2" />
                    <span>{exam.submissions?.length || 0} submissions</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Questions</span>
                    <span className="font-medium">{exam.questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-500">Total Points</span>
                    <span className="font-medium">
                      {exam.questions.reduce((sum, q) => sum + q.points, 0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Override Modal */}
      {overrideModal.isOpen && (
        <Modal
          isOpen={overrideModal.isOpen}
          onClose={() => setOverrideModal({ isOpen: false, submission: null, question: null, selectedSubmissions: [] })}
          title={overrideModal.selectedSubmissions?.length 
            ? `Override Grades for ${overrideModal.selectedSubmissions.length} Students`
            : "Override Grade"}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Score
              </label>
              <input
                type="number"
                min="0"
                max={overrideModal.question?.points}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Feedback
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter feedback..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOverrideModal({ isOpen: false, submission: null, question: null, selectedSubmissions: [] })}
                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (overrideModal.selectedSubmissions?.length) {
                    handleSaveBulkOverride(
                      overrideModal.question!.id,
                      overrideModal.selectedSubmissions,
                      0,
                      ""
                    );
                  }
                  setOverrideModal({ isOpen: false, submission: null, question: null, selectedSubmissions: [] });
                }}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default GradingPage;
