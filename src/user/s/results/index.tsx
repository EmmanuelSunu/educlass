import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";
import ResultCard from "../../../components/ResultCard";

// Sample data - Replace with actual data from your backend
const sampleResults = [
  {
    id: 1,
    examTitle: "Mid-Semester Assessment",
    className: "Advanced Database Systems",
    score: 85,
    totalPoints: 100,
    completionTime: "1h 45m",
    correctAnswers: 17,
    totalQuestions: 20,
    submittedDate: "22/03/2024",
    grade: "A"
  },
  {
    id: 2,
    examTitle: "Programming Concepts Quiz",
    className: "Introduction to Python",
    score: 72,
    totalPoints: 100,
    completionTime: "55m",
    correctAnswers: 14,
    totalQuestions: 20,
    submittedDate: "20/03/2024",
    grade: "B"
  },
  {
    id: 3,
    examTitle: "Network Security Test",
    className: "Cybersecurity Fundamentals",
    score: 65,
    totalPoints: 100,
    completionTime: "1h 30m",
    correctAnswers: 13,
    totalQuestions: 20,
    submittedDate: "18/03/2024",
    grade: "C"
  },
  {
    id: 4,
    examTitle: "Web Development Project",
    className: "Full Stack Development",
    score: 45,
    totalPoints: 100,
    completionTime: "2h",
    correctAnswers: 9,
    totalQuestions: 20,
    submittedDate: "15/03/2024",
    grade: "F"
  }
];

export default function ResultsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');

  const filteredResults = sampleResults.filter(result => {
    if (filter === 'all') return true;
    const score = (result.score / result.totalPoints) * 100;
    return filter === 'passed' ? score >= 50 : score < 50;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.submittedDate.split('/').reverse().join('-')).getTime() -
             new Date(a.submittedDate.split('/').reverse().join('-')).getTime();
    }
    return b.score - a.score;
  });

  const handleResultClick = (id: number) => {
    navigate(`/user/s/results/${id}`);
  };

  return (
    <DashboardLayout
      title="Exam Results"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-slate-200 p-2">
            <span className="text-sm font-medium text-slate-700 px-2">Filter:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('passed')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'passed'
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Passed
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'failed'
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Failed
            </button>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-slate-200 p-2">
            <span className="text-sm font-medium text-slate-700 px-2">Sort by:</span>
            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'date'
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Date
            </button>
            <button
              onClick={() => setSortBy('score')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'score'
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Score
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedResults.map(result => (
            <ResultCard
              key={result.id}
              onClick={handleResultClick}
              {...result}
            />
          ))}
        </div>

        {/* Empty State */}
        {sortedResults.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-600">Try changing your filters to see more results.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
