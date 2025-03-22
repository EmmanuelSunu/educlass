import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layout";
import { exams, type Exam } from "../../../../data";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface Question {
  id: string;
  type: "essay" | "multi-choice" | "fill-ins";
  questionText: string;
  options?: string[];
  questionAnswer: string;
  points: number;
}

const CreateExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
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
    if (id) {
      const exam = exams.find((e) => e.id === Number(id));
      if (exam) {
        setFormData(exam);
      }
    }
    setLoading(false);
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
      type: "multi-choice",
      questionText: "",
      options: ["", "", "", ""],
      questionAnswer: "",
      points: 5,
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
      questions: prev.questions?.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      ),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the exam data
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

  return (
    <DashboardLayout
      title={id ? "Edit Exam" : "Create Exam"}
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        {/* Basic Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Basic Information
          </h2>
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

        {/* Questions Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
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

          <div className="space-y-6">
            {formData.questions?.map((question, index) => (
              <div
                key={question.id}
                className="border border-slate-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-slate-800">
                    Question {index + 1}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-slate-600">Type:</label>
                      <select
                        value={question.type}
                        onChange={(e) =>
                          handleQuestionChange(
                            question.id,
                            "type",
                            e.target.value
                          )
                        }
                        className="px-2 py-1 border border-slate-300 rounded-md text-sm"
                      >
                        <option value="multi-choice">Multiple Choice</option>
                        <option value="essay">Essay</option>
                        <option value="fill-ins">Fill in the Blank</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-slate-600">Points:</label>
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
                        className="w-16 px-2 py-1 border border-slate-300 rounded-md text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
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
                      <label className="block text-sm font-medium text-slate-700">
                        Options
                      </label>
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
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/user/l/exams")}
            className="px-6 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            {id ? "Update Exam" : "Create Exam"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreateExam;