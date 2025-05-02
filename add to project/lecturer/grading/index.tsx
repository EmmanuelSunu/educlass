import { useState, useEffect } from "react";
import DashboardLayout from "../layout";
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiCheck, 
  FiClock, 
  FiAlertCircle,
  FiEdit2,
  FiDownload,
  FiSearch,
  FiX
} from "react-icons/fi";

interface Student {
  id: string;
  indexNumber: string;
  name: string;
  answer: string;
  score?: number;
  feedback?: string;
  status: "pending" | "graded" | "in_progress";
  lastModified?: string;
  manuallyGraded?: boolean;
}

interface Question {
  id: string;
  text: string;
  type: "multiple_choice" | "true_false";
  options: string[];
  correctAnswer: string;
  points: number;
  submissions: Student[];
  stats?: {
    averageScore: number;
    gradedCount: number;
    pendingCount: number;
    highestScore: number;
    lowestScore: number;
  };
}

// Mock data
const mockQuestions: Question[] = [
  {
    id: "q1",
    text: "Explain the concept of object-oriented programming and its main principles.",
    type: "multiple_choice",
    options: ["Object-oriented programming is a programming paradigm based on objects that contain data and code...", "OOP is a programming approach that uses objects and classes...", "Functional programming is a programming paradigm based on functions..."],
    correctAnswer: "Object-oriented programming is a programming paradigm based on objects that contain data and code...",
    points: 10,
    submissions: [],
    stats: {
      averageScore: 0,
      gradedCount: 0,
      pendingCount: 0,
      highestScore: 0,
      lowestScore: 0
    }
  },
  // Add more questions...
];

interface ManualOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Student | null;
  question: Question | null;
  onSave: (score: number, feedback: string) => void;
}

const ManualOverrideModal = ({ isOpen, onClose, submission, question, onSave }: ManualOverrideModalProps) => {
  const [score, setScore] = useState<number>(submission?.score || 0);
  const [feedback, setFeedback] = useState(submission?.feedback || "");

  useEffect(() => {
    if (submission) {
      setScore(submission.score || 0);
      setFeedback(submission.feedback || "");
    }
  }, [submission]);

  if (!isOpen || !submission || !question) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Manual Grade Override
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full"
            >
              <FiX className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="mb-4">
            <div className="text-sm text-slate-600 mb-2">Student Index Number</div>
            <div className="font-medium text-slate-800">{submission.indexNumber}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-slate-600 mb-2">Answer</div>
            <div className="bg-slate-50 p-3 rounded text-slate-800 text-sm">
              {submission.answer}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-slate-600 mb-2">Model Answer</div>
            <div className="bg-slate-50 p-3 rounded text-slate-800 text-sm">
              {question.correctAnswer}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-slate-600 mb-2">
              Score (out of {question.points})
            </label>
            <input
              type="number"
              min="0"
              max={question.points}
              value={score}
              onChange={(e) => setScore(Math.min(question.points, Math.max(0, Number(e.target.value))))}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-slate-600 mb-2">
              Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Provide feedback for the student..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(score, feedback);
                onClose();
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GradingPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "graded">("all");
  const [sortBy, setSortBy] = useState<"name" | "status" | "score">("status");
  const [overrideModal, setOverrideModal] = useState<{
    isOpen: boolean;
    submission: Student | null;
    question: Question | null;
  }>({
    isOpen: false,
    submission: null,
    question: null
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Calculate stats for each question
        const questionsWithStats = mockQuestions.map(q => ({
          ...q,
          stats: calculateQuestionStats(q)
        }));
        setQuestions(questionsWithStats);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const calculateQuestionStats = (question: Question) => {
    const gradedSubmissions = questions.filter(q => q.id === question.id).flatMap(q => q.submissions.filter(s => s.status === "graded"));
    return {
      averageScore: gradedSubmissions.length > 0 
        ? gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length
        : 0,
      gradedCount: gradedSubmissions.length,
      pendingCount: questions.filter(q => q.id === question.id).flatMap(q => q.submissions.filter(s => s.status === "pending")).length,
      highestScore: gradedSubmissions.length > 0 
        ? Math.max(...gradedSubmissions.map(s => s.score || 0))
        : 0,
      lowestScore: gradedSubmissions.length > 0 
        ? Math.min(...gradedSubmissions.map(s => s.score || 0))
        : 0
    };
  };

  const handleGradeQuestion = async (questionId: string) => {
    // Implement AI grading logic here
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          submissions: q.submissions.map(s => ({
            ...s,
            status: "in_progress" as const
          }))
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleManualOverride = (questionId: string, submissionId: string) => {
    const question = questions.find(q => q.id === questionId);
    const submission = question?.submissions.find(s => s.id === submissionId);
    
    if (question && submission) {
      setOverrideModal({
        isOpen: true,
        submission,
        question
      });
    }
  };

  const handleSaveOverride = (questionId: string, submissionId: string, score: number, feedback: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          submissions: q.submissions.map(s => {
            if (s.id === submissionId) {
              return {
                ...s,
                score,
                feedback,
                status: "graded",
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

  const handleExportGrades = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const csvContent = [
      ["Student Index", "Status", "Score", "Feedback", "Last Modified", "Grading Type"].join(","),
      ...question.submissions.map(s => [
        s.indexNumber,
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

  const filteredQuestions = questions.map(question => ({
    ...question,
    submissions: question.submissions.filter(submission => {
      const matchesSearch = submission.indexNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || submission.status === filterStatus;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.indexNumber.localeCompare(b.indexNumber);
        case "score":
          return ((b.score || 0) - (a.score || 0));
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    })
  }));

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
      ) : (
        <div className="space-y-6 pb-6">
          {/* Global Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by index number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="graded">Graded</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="status">Sort by Status</option>
                  <option value="name">Sort by Name</option>
                  <option value="score">Sort by Score</option>
                </select>
              </div>
            </div>
          </div>

          {filteredQuestions.map((question) => (
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
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      {question.text}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>Question {question.id}</span>
                      <span>{question.points} Points</span>
                      <span>{question.submissions.length} Submissions</span>
                      {question.stats && (
                        <span className="text-emerald-600">
                          {question.stats.gradedCount} Graded
                        </span>
                      )}
                    </div>
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
                  <div className="p-6 space-y-6 mb-6">
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">Question</h4>
                      <p className="text-slate-600">{question.text}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">Model Answer</h4>
                      <p className="text-slate-600">{question.correctAnswer}</p>
                    </div>

                    {/* Submissions */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-slate-800">Student Submissions</h4>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleGradeQuestion(question.id)}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                          >
                            Grade All Submissions
                          </button>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-200">
                        {question.submissions.map((submission) => (
                          <div key={submission.id} className="py-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-800">
                                  {submission.indexNumber}
                                </span>
                                {submission.status === "graded" && (
                                  <span className="flex items-center gap-1 text-sm text-emerald-600">
                                    <FiCheck className="w-4 h-4" />
                                    Graded {submission.manuallyGraded && "(Manual)"}
                                  </span>
                                )}
                                {submission.status === "in_progress" && (
                                  <span className="flex items-center gap-1 text-sm text-blue-600">
                                    <FiClock className="w-4 h-4" />
                                    Grading...
                                  </span>
                                )}
                                {submission.status === "pending" && (
                                  <span className="flex items-center gap-1 text-sm text-slate-600">
                                    <FiAlertCircle className="w-4 h-4" />
                                    Pending
                                  </span>
                                )}
                                {submission.lastModified && (
                                  <span className="text-xs text-slate-500">
                                    Last modified: {new Date(submission.lastModified).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {submission.score !== undefined && (
                                  <span className="text-sm font-medium text-slate-800">
                                    {submission.score}/{question.points}
                                  </span>
                                )}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleManualOverride(question.id, submission.id);
                                  }}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-600"
                                  title="Manual override"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-slate-600 text-sm">{submission.answer}</p>
                            {submission.feedback && (
                              <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded">
                                <span className="font-medium">Feedback: </span>
                                {submission.feedback}
                              </div>
                            )}
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
      )}

      {/* Add the Manual Override Modal */}
      <ManualOverrideModal
        isOpen={overrideModal.isOpen}
        onClose={() => setOverrideModal({ isOpen: false, submission: null, question: null })}
        submission={overrideModal.submission}
        question={overrideModal.question}
        onSave={(score, feedback) => {
          if (overrideModal.question && overrideModal.submission) {
            handleSaveOverride(
              overrideModal.question.id,
              overrideModal.submission.id,
              score,
              feedback
            );
          }
        }}
      />
    </DashboardLayout>
  );
};

export default GradingPage;
