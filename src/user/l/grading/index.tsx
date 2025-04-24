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
  FiX,
  FiSave
} from "react-icons/fi";
import Modal from "../../../components/Modal";

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
  aiFeedback?: string;
  studentId: string;
}

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
}

// Mock data
const mockQuestions: Question[] = [
  {
    id: "1",
    text: "Explain the concept of machine learning and its applications in education.",
    type: "essay",
    points: 20,
    submissions: [
      {
        id: "1",
        studentId: "STU001",
        answer: "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. In education, it can be used for personalized learning, automated grading, and predictive analytics to identify students who might need additional support.",
        score: 18,
        status: "graded",
        feedback: "Good explanation of machine learning and its educational applications. Could have included more specific examples of ML algorithms used in education.",
        aiFeedback: "The answer provides a clear definition of machine learning and mentions key educational applications. The response could be enhanced with specific examples of ML algorithms and their impact on learning outcomes.",
        manuallyGraded: false,
        lastModified: "2024-03-15T10:30:00Z"
      },
      // ... other submissions ...
    ]
  },
  {
    id: "2",
    text: "What are the main components of a neural network?",
    type: "multi-choice",
    points: 10,
    submissions: [
      {
        id: "3",
        studentId: "STU003",
        answer: "Input layer, hidden layers, and output layer",
        score: 10,
        status: "graded",
        feedback: "Correct answer. Well done!",
        aiFeedback: "The answer correctly identifies all three main components of a neural network: input layer, hidden layers, and output layer.",
        manuallyGraded: false,
        lastModified: "2024-03-15T11:15:00Z"
      },
      // ... other submissions ...
    ]
  }
];

interface OverrideModal {
  isOpen: boolean;
  submission: Submission | null;
  question: Question | null;
  selectedSubmissions?: Submission[];
}

const ManualOverrideModal = ({ isOpen, onClose, submission, question, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  question: Question | null;
  onSave: (score: number, feedback: string) => void;
}) => {
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manual Grade Override"
    >
      <div className="space-y-4">
        <div>
          <div className="text-sm text-slate-600 mb-2">Student Index Number</div>
          <div className="font-medium text-slate-800">{submission.studentId}</div>
        </div>

        <div>
          <div className="text-sm text-slate-600 mb-2">Answer</div>
          <div className="bg-slate-50 p-3 rounded text-slate-800 text-sm">
            {submission.answer}
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-600 mb-2">Model Answer</div>
          <div className="bg-slate-50 p-3 rounded text-slate-800 text-sm">
            {question.type === "multi-choice" ? "Multiple choice answer" : "Essay answer"}
          </div>
        </div>

        <div>
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

        <div>
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
    </Modal>
  );
};

const GradingPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "graded" | "pending">("all");
  const [sortBy, setSortBy] = useState<"id" | "score" | "status">("id");
  const [overrideModal, setOverrideModal] = useState<OverrideModal>({
    isOpen: false,
    submission: null,
    question: null,
    selectedSubmissions: []
  });
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());

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

  const handleBulkOverride = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const selectedStudents = question.submissions.filter(s => selectedSubmissions.has(s.id));
    setOverrideModal({
      isOpen: true,
      submission: null,
      question,
      selectedSubmissions: selectedStudents
    });
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

  const handleToggleSelection = (submissionId: string) => {
    const newSelection = new Set(selectedSubmissions);
    if (newSelection.has(submissionId)) {
      newSelection.delete(submissionId);
    } else {
      newSelection.add(submissionId);
    }
    setSelectedSubmissions(newSelection);
  };

  const filteredQuestions = questions.map(question => ({
    ...question,
    submissions: question.submissions
      .filter(submission => {
        const matchesSearch = submission.studentId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || submission.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "id":
            return a.studentId.localeCompare(b.studentId);
          case "score":
            return (b.score || 0) - (a.score || 0);
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
              <div className="flex justify-between gap-4 flex-1">
                <div className="relative flex-1 max-w-full">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by index number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex items-center gap-4 justify-between">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">All Status</option>
                    <option value="graded">Graded</option>
                    <option value="pending">Pending</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="id">Sort by ID</option>
                    <option value="score">Sort by Score</option>
                    <option value="status">Sort by Status</option>
                  </select>
                </div>
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
                    <h3 className="text-lg font-semibold text-slate-800">{question.text}</h3>
                    <p className="text-slate-600 mt-1">Type: {question.type}</p>
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
                  <div className="p-6 space-y-6 mb-6">
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">Question</h4>
                      <p className="text-slate-600">{question.text}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">Model Answer</h4>
                      <p className="text-slate-600">
                        {question.type === "multi-choice" ? "Multiple choice answer" : "Essay answer"}
                      </p>
                    </div>

                    {/* Submissions */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-slate-800">Student Submissions</h4>
                        <div className="flex items-center gap-2">
                          {selectedSubmissions.size > 0 && (
                            <button
                              onClick={() => handleBulkOverride(question.id)}
                              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                              <FiEdit2 className="w-4 h-4" />
                              Override Selected
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {question.submissions.map((submission) => (
                          <div key={submission.id} className="py-4 border-b border-slate-200 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={selectedSubmissions.has(submission.id)}
                                  onChange={() => handleToggleSelection(submission.id)}
                                  className="rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                <span className="font-medium text-slate-800">
                                  Student ID: {submission.studentId}
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
                                    setOverrideModal({
                                      isOpen: true,
                                      submission,
                                      question
                                    });
                                  }}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-600"
                                  title="Manual override"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-slate-600 text-sm mb-2">{submission.answer}</p>
                            {submission.aiFeedback && (
                              <div className="mb-2 text-sm text-slate-600 bg-blue-50 p-3 rounded">
                                <span className="font-medium">AI Feedback: </span>
                                {submission.aiFeedback}
                              </div>
                            )}
                            {submission.feedback && (
                              <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
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

      {/* Override Modal */}
      {overrideModal.isOpen && (
        <Modal
          isOpen={overrideModal.isOpen}
          onClose={() => setOverrideModal({ isOpen: false, submission: null, question: null })}
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
                onClick={() => setOverrideModal({ isOpen: false, submission: null, question: null })}
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
                      0, // This will be replaced with actual score
                      "" // This will be replaced with actual feedback
                    );
                  }
                  setOverrideModal({ isOpen: false, submission: null, question: null });
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
