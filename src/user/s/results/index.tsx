import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";
import ResultCard from "../../../components/ResultCard";
import { type Exam, type ExamSubmission } from "../../../data/exams/types";
import { getExams, getExamSubmissionsByStudentId } from "../../../data/exams/service";
import { useAuth } from "../../../data/auth/context";
import { FiBook } from "react-icons/fi";

interface ExamResult extends Exam {
  submission: ExamSubmission;
}

function StudentResults() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadResults = async () => {
      try {
        // Restore authentication checks
        if (!isAuthenticated || !user) {
          navigate('/login');
          return;
        }

        if (user.role !== 'student') {
          navigate('/user/l/dashboard');
          return;
        }

        // Use the actual student ID from the authenticated user
        const studentId = user.id;
        
        const allExams = await getExams();
        const submissions = await getExamSubmissionsByStudentId(studentId);
        
        // Match exams with their submissions
        const examResults = submissions.map(submission => {
          const exam = allExams.find(e => e.id === submission.examId);
          if (!exam) return null;
          return {
            ...exam,
            submission
          };
        }).filter((result): result is ExamResult => result !== null);

        setResults(examResults);
        setError(null);
      } catch (error) {
        console.error("Failed to load results:", error);
        setError("Failed to load your results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [user, isAuthenticated, navigate]);

  const handleResultClick = (id: number) => {
    navigate(`/user/s/results/${id}`);
  };

  if (loading) {
    return (
      <DashboardLayout 
        title="My Results" 
        buttonTitle=""
        showAddHeadbarButton={false}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBook className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading Results</h3>
            <p className="text-slate-600">Please wait while we fetch your results.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout 
        title="My Results" 
        buttonTitle=""
        showAddHeadbarButton={false}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBook className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Results</h3>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="My Results" 
      buttonTitle=""
      showAddHeadbarButton={false}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <ResultCard
              key={result.id}
              id={result.id}
              examTitle={result.title}
              className={result.className}
              score={result.submission.totalScore || 0}
              totalPoints={result.questions.reduce((sum, q) => sum + q.points, 0)}
              completionTime={result.submission.completionTime}
              submittedDate={result.submission.submittedAt}
              grade={result.submission.grade || "N/A"}
              onClick={handleResultClick}
            />
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBook className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Results Found</h3>
            <p className="text-slate-600">You haven't completed any exams yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentResults;
