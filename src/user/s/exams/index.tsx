import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { RiArrowRightLine, RiTimeLine, RiCalendarLine } from "react-icons/ri";
import Sidebar from "../Sidebar";
import PageHeader from "../../../components/PageHeader";
import { useApi } from "../../../contexts/ApiContext";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ApiErrorAlert from "../../../components/ApiErrorAlert";
import ExamsList from "./ExamsList";
import URLS from "../url";

interface Exam {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
  className: string;
}

const StudentExams: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiGet } = useApi();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        // Using the API context to fetch exams
        const response = await apiGet('/exams');
        setExams(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching exams:", err);
        setError("Failed to load exams. Please try again later.");
        // For development, using local JSON data as fallback
        import('../../../user/l/exams/data/exams.json')
          .then(module => {
            setExams(module.default);
            setError(null);
          })
          .catch(importErr => {
            console.error("Error loading fallback data:", importErr);
          });
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [apiGet]);

  const today = new Date();

  const upcomingExams = exams.filter((exam) => {
    const examDate = parseISO(exam.dueDate);
    return isAfter(examDate, today) && exam.status !== "completed";
  });

  const pastExams = exams.filter((exam) => {
    const examDate = parseISO(exam.dueDate);
    return isBefore(examDate, today) || exam.status === "completed";
  });

  const activeExams = activeTab === "upcoming" ? upcomingExams : pastExams;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Exams" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab === "upcoming"
                        ? "border-b-2 border-primary text-primary"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Upcoming Exams
                  </button>
                  <button
                    onClick={() => setActiveTab("past")}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab === "past"
                        ? "border-b-2 border-primary text-primary"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Past Exams
                  </button>
                </nav>
              </div>

              {loading ? (
                <div className="p-6 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <ApiErrorAlert message={error} />
              ) : (
                <ExamsList 
                  exams={activeExams} 
                  emptyMessage={
                    activeTab === "upcoming" 
                      ? "No upcoming exams scheduled." 
                      : "No past exams available."
                  } 
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentExams;