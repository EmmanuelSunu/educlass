
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";
import { FiEdit, FiCheck, FiClock, FiFileText, FiStar } from "react-icons/fi";
import { MdOutlineGrading, MdOutlineAutoGraph } from "react-icons/md";
import { HiOutlineTemplate } from "react-icons/hi";

// Types
interface Submission {
  id: number;
  studentName: string;
  studentId: string;
  examTitle: string;
  examId: number;
  submissionDate: string;
  status: "pending" | "graded" | "in_progress";
  score?: number;
  totalScore: number;
  feedback?: string;
  className: string;
}

interface GradingStats {
  totalGraded: number;
  pendingGrading: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

interface FeedbackTemplate {
  id: number;
  title: string;
  template: string;
}

const Grading = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"pending" | "history" | "statistics" | "templates">("pending");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmissions, setSelectedSubmissions] = useState<number[]>([]);
  const [stats, setStats] = useState<GradingStats>({
    totalGraded: 0,
    pendingGrading: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
  });
  const [feedbackTemplates, setFeedbackTemplates] = useState<FeedbackTemplate[]>([]);
  const [gradingInProgress, setGradingInProgress] = useState<boolean>(false);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [manualScore, setManualScore] = useState<number | undefined>(undefined);
  const [manualFeedback, setManualFeedback] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Mock data loading
  useEffect(() => {
    // This would be an API call in a real application
    const mockSubmissions: Submission[] = [
      {
        id: 1,
        studentName: "John Doe",
        studentId: "S001",
        examTitle: "Midterm Exam",
        examId: 101,
        submissionDate: "2023-05-15T14:30:00",
        status: "pending",
        totalScore: 100,
        className: "BSc ICT"
      },
      {
        id: 2,
        studentName: "Jane Smith",
        studentId: "S002",
        examTitle: "Final Assignment",
        examId: 102,
        submissionDate: "2023-05-16T10:15:00",
        status: "pending",
        totalScore: 50,
        className: "BSc ICT"
      },
      {
        id: 3,
        studentName: "Alice Johnson",
        studentId: "S003",
        examTitle: "Programming Quiz",
        examId: 103,
        submissionDate: "2023-05-14T09:00:00",
        status: "graded",
        score: 85,
        totalScore: 100,
        feedback: "Excellent work on the algorithms section!",
        className: "BSc Software Engineering"
      },
      {
        id: 4,
        studentName: "Bob Wilson",
        studentId: "S004",
        examTitle: "Database Project",
        examId: 104,
        submissionDate: "2023-05-13T16:45:00",
        status: "graded",
        score: 72,
        totalScore: 100,
        feedback: "Good understanding of relational database concepts, but needs improvement on normalization.",
        className: "MSc Data Science"
      },
      {
        id: 5,
        studentName: "Emma Davis",
        studentId: "S005",
        examTitle: "Web Development Assignment",
        examId: 105,
        submissionDate: "2023-05-17T11:30:00",
        status: "pending",
        totalScore: 100,
        className: "MSc CS"
      },
    ];

    const mockTemplates: FeedbackTemplate[] = [
      {
        id: 1,
        title: "Excellent Work",
        template: "Excellent work! Your understanding of the concepts is clear and comprehensive. Keep up the great work!"
      },
      {
        id: 2,
        title: "Good Job",
        template: "Good job on this assignment. Your work demonstrates a solid understanding of the material."
      },
      {
        id: 3,
        title: "Needs Improvement",
        template: "While you've made a good attempt, there are areas that need improvement. Focus on [specific areas] in your future work."
      },
      {
        id: 4,
        title: "Review Concepts",
        template: "Please review the core concepts of [topic]. Your work shows some misunderstandings that should be addressed."
      }
    ];

    // Calculate statistics based on mock data
    const gradedSubmissions = mockSubmissions.filter(sub => sub.status === "graded");
    const mockStats: GradingStats = {
      totalGraded: gradedSubmissions.length,
      pendingGrading: mockSubmissions.filter(sub => sub.status === "pending").length,
      averageScore: gradedSubmissions.length > 0 
        ? gradedSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / gradedSubmissions.length 
        : 0,
      highestScore: gradedSubmissions.length > 0 
        ? Math.max(...gradedSubmissions.map(sub => sub.score || 0)) 
        : 0,
      lowestScore: gradedSubmissions.length > 0 
        ? Math.min(...gradedSubmissions.map(sub => sub.score || 0)) 
        : 0,
    };

    setSubmissions(mockSubmissions);
    setStats(mockStats);
    setFeedbackTemplates(mockTemplates);
  }, []);

  // Filter submissions based on search term and active tab
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.className.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch && (
      (activeTab === "pending" && sub.status === "pending") ||
      (activeTab === "history" && sub.status === "graded")
    );
  });

  // Start AI-assisted grading for a submission
  const handleStartGrading = (submission: Submission) => {
    setCurrentSubmission(submission);
    setGradingInProgress(true);
    setManualScore(undefined);
    setManualFeedback("");
    
    // Simulate AI generating a suggestion
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * (submission.totalScore + 1));
      setManualScore(randomScore);
      setAiSuggestion(`Based on the submission, I suggest a score of ${randomScore}/${submission.totalScore}. 
        The student demonstrated good understanding of core concepts but missed some key details in sections 2 and 4.`);
    }, 1500);
  };

  // Submit the grade for a submission
  const handleSubmitGrade = () => {
    if (!currentSubmission || manualScore === undefined) return;
    
    // Update the submission in state
    const updatedSubmissions = submissions.map(sub => {
      if (sub.id === currentSubmission.id) {
        return {
          ...sub,
          status: "graded" as const,
          score: manualScore,
          feedback: manualFeedback
        };
      }
      return sub;
    });
    
    setSubmissions(updatedSubmissions);
    
    // Update statistics
    const gradedSubmissions = updatedSubmissions.filter(sub => sub.status === "graded");
    setStats({
      totalGraded: gradedSubmissions.length,
      pendingGrading: updatedSubmissions.filter(sub => sub.status === "pending").length,
      averageScore: gradedSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / gradedSubmissions.length,
      highestScore: Math.max(...gradedSubmissions.map(sub => sub.score || 0)),
      lowestScore: Math.min(...gradedSubmissions.map(sub => sub.score || 0)),
    });
    
    // Reset grading state
    setGradingInProgress(false);
    setCurrentSubmission(null);
    setManualScore(undefined);
    setManualFeedback("");
    setAiSuggestion("");
  };

  // Select submissions for batch processing
  const handleSelectSubmission = (id: number) => {
    if (selectedSubmissions.includes(id)) {
      setSelectedSubmissions(selectedSubmissions.filter(subId => subId !== id));
    } else {
      setSelectedSubmissions([...selectedSubmissions, id]);
    }
  };

  // Apply a feedback template
  const handleApplyTemplate = (template: string) => {
    setManualFeedback(template);
  };

  return (
    <DashboardLayout
      title="Grading"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      {/* Main content area */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap mb-4 border-b">
            <button
              onClick={() => setActiveTab("pending")}
              className={`mr-4 py-2 px-4 text-sm font-medium ${
                activeTab === "pending"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              <div className="flex items-center">
                <FiClock className="mr-2" />
                Pending Grading <span className="ml-2 bg-amber-100 text-amber-800 text-xs font-medium rounded-full px-2 py-0.5">{stats.pendingGrading}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`mr-4 py-2 px-4 text-sm font-medium ${
                activeTab === "history"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              <div className="flex items-center">
                <FiFileText className="mr-2" />
                Grading History
              </div>
            </button>
            <button
              onClick={() => setActiveTab("statistics")}
              className={`mr-4 py-2 px-4 text-sm font-medium ${
                activeTab === "statistics"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              <div className="flex items-center">
                <MdOutlineAutoGraph className="mr-2" />
                Statistics
              </div>
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`mr-4 py-2 px-4 text-sm font-medium ${
                activeTab === "templates"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              <div className="flex items-center">
                <HiOutlineTemplate className="mr-2" />
                Feedback Templates
              </div>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary" 
              placeholder="Search by student name, exam title, or class"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Pending Submissions Tab */}
          {activeTab === "pending" && (
            <div>
              {selectedSubmissions.length > 0 && (
                <div className="flex justify-between mb-4 p-2 bg-gray-50 rounded-md">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{selectedSubmissions.length} submissions selected</span>
                  </div>
                  <div>
                    <button 
                      className="bg-primary text-white px-3 py-1 rounded-md text-sm mr-2"
                      onClick={() => {
                        // Implement batch grading logic
                        alert("Batch grading would start here");
                      }}
                    >
                      Grade Batch
                    </button>
                    <button 
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
                      onClick={() => setSelectedSubmissions([])}
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}
              
              {filteredSubmissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubmissions(filteredSubmissions.map(sub => sub.id));
                              } else {
                                setSelectedSubmissions([]);
                              }
                            }}
                            checked={selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                          />
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exam
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submission Date
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSubmissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                              checked={selectedSubmissions.includes(submission.id)}
                              onChange={() => handleSelectSubmission(submission.id)}
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                            <div className="text-xs text-gray-500">{submission.studentId}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{submission.className}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{submission.examTitle}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(submission.submissionDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(submission.submissionDate).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              onClick={() => handleStartGrading(submission)}
                              className="bg-primary text-white px-3 py-1 rounded-md text-sm flex items-center"
                            >
                              <MdOutlineGrading className="mr-1" /> Grade
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No pending submissions to grade</p>
                </div>
              )}
            </div>
          )}

          {/* Grading History Tab */}
          {activeTab === "history" && (
            <div>
              {filteredSubmissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exam
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Graded Date
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Feedback
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSubmissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                            <div className="text-xs text-gray-500">{submission.studentId}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{submission.className}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{submission.examTitle}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {submission.score}/{submission.totalScore}
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.round((submission.score || 0) / submission.totalScore * 100)}%
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(submission.submissionDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {submission.feedback || "No feedback provided"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No grading history found</p>
                </div>
              )}
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === "statistics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <FiCheck className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Graded</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalGraded}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                    <FiClock className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending Grading</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.pendingGrading}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <FiStar className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Average Score</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.averageScore.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <FiStar className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Highest Score</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.highestScore}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                    <FiStar className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lowest Score</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.lowestScore}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Templates Tab */}
          {activeTab === "templates" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbackTemplates.map(template => (
                <div key={template.id} className="bg-white border rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{template.title}</h3>
                  <p className="text-gray-700 mb-4">{template.template}</p>
                  <div className="flex justify-end">
                    <button 
                      className="bg-primary text-white px-3 py-1 rounded-md text-sm mr-2"
                      onClick={() => {
                        if (gradingInProgress) {
                          handleApplyTemplate(template.template);
                        } else {
                          alert("Start grading a submission first to use this template");
                        }
                      }}
                    >
                      Use Template
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
              <div className="bg-gray-50 border border-dashed rounded-lg p-4 flex items-center justify-center">
                <button className="text-primary flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Template
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI-assisted grading modal */}
      {gradingInProgress && currentSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-2xl">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Grading: {currentSubmission.examTitle}
                    </h3>
                    <div className="mt-2">
                      <div className="text-sm text-gray-500 mb-4">
                        <p className="font-medium">Student: {currentSubmission.studentName} ({currentSubmission.studentId})</p>
                        <p>Class: {currentSubmission.className}</p>
                        <p>Submitted: {new Date(currentSubmission.submissionDate).toLocaleString()}</p>
                      </div>
                      
                      {/* AI Suggestion Section */}
                      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                        <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          AI-Suggested Grading
                        </h4>
                        {aiSuggestion ? (
                          <div>
                            <p className="text-sm text-gray-700 mb-2">{aiSuggestion}</p>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-700 mr-2">Suggested Score:</span>
                              <span className="text-lg font-semibold text-blue-600">{manualScore}/{currentSubmission.totalScore}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center p-4">
                            <svg className="animate-spin h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-blue-600">Analyzing submission...</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Manual Override Section */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <FiEdit className="mr-2" />
                          Manual Override
                        </h4>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Score
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={currentSubmission.totalScore}
                            value={manualScore || ""}
                            onChange={(e) => setManualScore(parseInt(e.target.value) || 0)}
                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Feedback
                          </label>
                          <textarea
                            rows={4}
                            value={manualFeedback}
                            onChange={(e) => setManualFeedback(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            placeholder="Provide feedback to the student..."
                          ></textarea>
                        </div>
                      </div>
                      
                      {/* Template Options */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Templates</h4>
                        <div className="flex flex-wrap gap-2">
                          {feedbackTemplates.map(template => (
                            <button
                              key={template.id}
                              onClick={() => handleApplyTemplate(template.template)}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                            >
                              {template.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSubmitGrade}
                >
                  Submit Grade
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setGradingInProgress(false);
                    setCurrentSubmission(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Grading;
