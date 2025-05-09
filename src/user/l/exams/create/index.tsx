import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layout/index";
import { type Exam } from "../../../../data/exams/types";
import { type RubricCriteria } from "../../../../data/exams/types";
import { getExamById } from "../../../../data/exams/service";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronRight } from "react-icons/fi";

interface Question {
  id: string;
  type: "essay" | "multi-choice" | "fill-ins";
  questionText: string;
  options?: string[];
  questionAnswer: string;
  points: number;
  rubricCriteria?: RubricCriteria[];
}

const defaultRubricCriteria: RubricCriteria[] = [
  {
    name: "Concept Mastery",
    value: 0, // Dynamically Weighted
    description: "Evaluation of the student's understanding and application of key concepts",
  },
  {
    name: "Comprehensiveness",
    value: 0, // Dynamically Weighted
    description: "Assessment of completeness in covering all essential points from the model answer",
  },
  {
    name: "Clarity and Structure",
    value: 0, // Dynamically Weighted
    description: "Analysis of organization, flow, and presentation of ideas",
  },
  {
    name: "Critical Thinking",
    value: 0, // Dynamically Weighted
    description: "Evaluation of original thought and application beyond simple matching to the prompt",
  },
  {
    name: "Precision",
    value: 0, // Dynamically Weighted
    description: "Assessment of technical accuracy and specificity in the response",
  },
];

const CreateExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Exam>>({
    title: "",
    type: "exam",
    duration: "",
    durationHours: 0,
    durationMinutes: 0,
    startTime: "",
    endTime: "",
    dueDate: "",
    description: "",
    classId: 1,
    className: "",
    questions: [],
  });

  useEffect(() => {
    const loadExam = async () => {
      if (id) {
        const exam = getExamById(Number(id));
        if (exam) {
          // Ensure each essay question has rubric criteria
          const updatedQuestions = exam.questions?.map(question => {
            if (question.type === "essay" && !question.rubricCriteria) {
              return {
                ...question,
                rubricCriteria: [...defaultRubricCriteria]
              };
            }
            return question;
          });
          
          setFormData({
            ...exam,
            questions: updatedQuestions
          });
        }
      }
      setLoading(false);
    };
    loadExam();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "hours" | "minutes"
  ) => {
    const value = parseInt(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      [type === "hours" ? "durationHours" : "durationMinutes"]: value,
      duration: `${type === "hours" ? value : prev.durationHours || 0} hours ${
        type === "minutes" ? value : prev.durationMinutes || 0
      } minutes`,
    }));
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q${(formData.questions?.length || 0) + 1}`,
      type: "essay",
      questionText: "",
      options: [],
      questionAnswer: "",
      points: 5,
      rubricCriteria: [...defaultRubricCriteria]
    };

    setFormData((prev) => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion],
    }));
  };

  const handleQuestionChange = (
    questionId: string,
    field: keyof Question,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions?.map((q) => {
        if (q.id !== questionId) return q;
        
        if (field === "type") {
          // When changing to essay type, ensure rubric criteria are set
          if (value === "essay") {
            return {
              ...q,
              [field]: value,
              options: undefined,
              rubricCriteria: [...defaultRubricCriteria]
            };
          }
          // When changing to other types, remove rubric criteria
          return {
            ...q,
            [field]: value,
            rubricCriteria: undefined,
            options: value === "multi-choice" ? ["Option 1"] : undefined
          };
        }
        
        return { ...q, [field]: value };
      }),
    }));
  };

  const handleOptionChange = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions?.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions?.filter((q) => q.id !== questionId),
    }));
  };

  const handleRubricCriteriaChange = (
    questionId: string,
    criteriaIndex: number,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions?.map((q) =>
        q.id === questionId && q.rubricCriteria
          ? {
              ...q,
              rubricCriteria: q.rubricCriteria.map((c, idx) =>
                idx === criteriaIndex ? { ...c, value: Math.round(value) } : c
              ),
            }
          : q
      ),
    }));
  };

  const getRubricTotal = (criteria: RubricCriteria[]) => {
    return criteria.reduce((sum, c) => sum + c.value, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the exam data
    navigate("/user/l/exams");
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleAddOption = (questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions?.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`],
            }
          : q
      ),
    }));
  };

  const handleDeleteOption = (questionId: string, optionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions?.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.filter((_, idx) => idx !== optionIndex),
            }
          : q
      ),
    }));
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

  return (
    <DashboardLayout
      title={id ? "Edit Exam" : "Create Exam"}
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Tabs */}
          <div className="mb-6 border-b">
            <div className="flex space-x-4">
              <button
                type="button"
                className={`py-2 px-4 font-medium ${
                  activeTab === "details"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Exam Details
              </button>
              <button
                type="button"
                className={`py-2 px-4 font-medium ${
                  activeTab === "questions"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("questions")}
              >
                Questions
              </button>
            </div>
          </div>

          {/* Exam Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Class
                  </label>
                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Select a class</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Database Management">Database Management</option>
                    <option value="Data Structures">Data Structures</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Duration (Hours)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.durationHours}
                      onChange={(e) => handleDurationChange(e, "hours")}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={formData.durationMinutes}
                      onChange={(e) => handleDurationChange(e, "minutes")}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === "questions" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-800">Questions</h2>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.questions?.map((question, index) => (
                  <div
                    key={question.id}
                    className="border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <div 
                      className="flex justify-between items-center p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => toggleQuestion(question.id)}
                    >
                      <div className="flex items-center space-x-2">
                        {expandedQuestions.includes(question.id) ? (
                          <FiChevronDown className="w-5 h-5 text-slate-600" />
                        ) : (
                          <FiChevronRight className="w-5 h-5 text-slate-600" />
                        )}
                        <h3 className="font-medium text-slate-800">
                          Question {index + 1}
                        </h3>
                        <span className="text-sm text-slate-500">
                          ({question.type})
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-600">{question.points} points</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuestion(question.id);
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {expandedQuestions.includes(question.id) && (
                      <div className="p-4 border-t border-slate-200">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Type
                              </label>
                              <select
                                value={question.type}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    question.id,
                                    "type",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                              >
                                <option value="multi-choice">Multiple Choice</option>
                                <option value="essay">Essay</option>
                                <option value="fill-ins">Fill in the Blank</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Points
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={question.points}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    question.id,
                                    "points",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Question Text
                            </label>
                            <textarea
                              value={question.questionText}
                              onChange={(e) =>
                                handleQuestionChange(
                                  question.id,
                                  "questionText",
                                  e.target.value
                                )
                              }
                              rows={2}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>

                          {question.type === "multi-choice" && (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-slate-700">
                                  Options
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleAddOption(question.id)}
                                  className="flex items-center space-x-1 px-2 py-1 text-sm text-primary hover:text-primary/80"
                                >
                                  <FiPlus className="w-3 h-3" />
                                  <span>Add Option</span>
                                </button>
                              </div>
                              {question.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={option === question.questionAnswer}
                                    onChange={() =>
                                      handleQuestionChange(
                                        question.id,
                                        "questionAnswer",
                                        option
                                      )
                                    }
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        question.id,
                                        optionIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className="flex-1 px-3 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                  />
                                  {question.options && question.options.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteOption(question.id, optionIndex)}
                                      className="text-red-500 hover:text-red-600"
                                    >
                                      <FiTrash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {(question.type === "essay" ||
                            question.type === "fill-ins") && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                {question.type === "essay"
                                  ? "Model Answer"
                                  : "Correct Answer"}
                              </label>
                              <textarea
                                value={question.questionAnswer}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    question.id,
                                    "questionAnswer",
                                    e.target.value
                                  )
                                }
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              />
                              
                              {question.type === "essay" && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium text-slate-700 mb-2">Rubric Criteria</h4>
                                  <div className="space-y-3">
                                    {question.rubricCriteria?.map((criteria, criteriaIndex) => (
                                      <div key={criteriaIndex} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-sm font-medium text-slate-700 group relative cursor-help">
                                            {criteria.name}
                                            <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10">
                                              {criteria.description}
                                              <span className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800"></span>
                                            </span>
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={criteria.value}
                                            onChange={(e) => handleRubricCriteriaChange(question.id, criteriaIndex, parseInt(e.target.value) || 0)}
                                            className="w-16 px-2 py-1 border border-slate-300 rounded-md text-sm"
                                          />
                                          <span className="text-sm text-slate-500">%</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  {question.rubricCriteria && (
                                    <div className="mt-3">
                                      <p className={`text-sm ${getRubricTotal(question.rubricCriteria) === 100 ? 'text-green-600' : 'text-red-600'}`}>
                                        Total: {getRubricTotal(question.rubricCriteria)}%
                                        {getRubricTotal(question.rubricCriteria) !== 100 && (
                                          <span className="ml-2">(Must equal 100%)</span>
                                        )}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/user/l/exams")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {id ? "Update Exam" : "Create Exam"}
            </button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreateExam;