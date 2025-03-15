import React, { useState, useEffect } from "react";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";

interface ExamDetails {
  id: number;
  title: string;
  type: "exam" | "test" | "assignment";
  duration: string;
  durationHours: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  status: "scheduled" | "in-progress" | "completed";
  dueDate: string;
  description: string;
  questions: Array<{
    id: string;
    type: "multi-choice" | "essay" | "fill-ins";
    questionText: string;
    options?: string[];
    questionAnswer: string;
  }>;
  classId?: number;
  className?: string;
}

interface Class {
  id: number;
  name: string;
}

interface ExamFormProps {
  examDetails: ExamDetails;
  onExamChange: (examDetails: ExamDetails) => void;
  onSave: () => void;
  onCancel: () => void;
}

const mockClasses: Class[] = [
  { id: 1, name: "Mathematics 101" },
  { id: 2, name: "Physics 201" },
  { id: 3, name: "Computer Science 301" },
  { id: 4, name: "Biology 101" },
  { id: 5, name: "Chemistry 201" },
];

const ExamForm: React.FC<ExamFormProps> = ({
  examDetails,
  onExamChange,
  onSave,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (!examDetails.durationHours && !examDetails.durationMinutes) {
      const durationRegex = /(\d+)\s*hour[s]?(?:\s*and\s*(\d+)\s*minute[s]?)?/i;
      const match = examDetails.duration.match(durationRegex);

      if (match) {
        const hours = parseInt(match[1]) || 0;
        const minutes = match[2] ? parseInt(match[2]) : 0;

        onExamChange({
          ...examDetails,
          durationHours: hours,
          durationMinutes: minutes,
        });
      } else {
        onExamChange({
          ...examDetails,
          durationHours: 1,
          durationMinutes: 0,
        });
      }
    }
  }, []);

  const handleInputChange = (name: string, value: string | number) => {
    onExamChange({
      ...examDetails,
      [name]: value,
    });
  };

  const handleAddQuestion = () => {
    // Fix: Explicitly specify the type as a valid literal type
    const newQuestion = {
      id: String(
        examDetails.questions.length > 0
          ? Math.max(...examDetails.questions.map((q) => Number(q.id))) + 1
          : 1,
      ),
      type: "essay" as const, // Use "as const" to specify this is a literal type
      questionText: "",
      questionAnswer: "",
      options: [] as string[], // Properly type the options array
    };

    onExamChange({
      ...examDetails,
      questions: [...examDetails.questions, newQuestion],
    });
  };

  const handleAddOption = (index: number) => {
    const updatedQuestions = [...examDetails.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      options: [...(updatedQuestions[index].options || []), ""],
    };
    onExamChange({ ...examDetails, questions: updatedQuestions });
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...examDetails.questions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options?.filter((_, i) => i !== optionIndex);
    onExamChange({ ...examDetails, questions: updatedQuestions });
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const updatedQuestions = [...examDetails.questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options[optionIndex] = value;
    }
    onExamChange({ ...examDetails, questions: updatedQuestions });
  };

  const handleQuestionChange = (
    index: number,
    field: "questionText" | "questionAnswer" | "type",
    value: string,
  ) => {
    const updatedQuestions = [...examDetails.questions];

    if (field === "type") {
      // Ensure the type is treated as a valid question type
      const questionType = value as "multi-choice" | "essay" | "fill-ins";
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        type: questionType,
      };
    } else {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };
    }

    onExamChange({
      ...examDetails,
      questions: updatedQuestions,
    });
  };

  const handleRemoveQuestion = (id: string) => {
    onExamChange({
      ...examDetails,
      questions: examDetails.questions.filter((q) => q.id !== id),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 border-b">
        <div className="flex space-x-4">
          <button
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

      {activeTab === "details" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="text-span text-dark font-medium block pb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={examDetails.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
                placeholder="Enter exam title"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-span text-dark font-medium block pb-2">
                Type
              </label>
              <select
                name="type"
                value={examDetails.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
              >
                <option value="exam">Exam</option>
                <option value="test">Test</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="text-span text-dark font-medium block pb-2">
                Class
              </label>
              <select
                name="classId"
                value={examDetails.classId || ""}
                onChange={(e) => {
                  const classId = parseInt(e.target.value, 10);
                  const selectedClass = mockClasses.find(
                    (c) => c.id === classId,
                  );
                  handleInputChange("classId", classId);
                  handleInputChange("className", selectedClass?.name || "");
                }}
                className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
              >
                <option value="">Select a class</option>
                {mockClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="text-span text-dark font-medium block pb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={examDetails.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="text-span text-dark font-medium block pb-2">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={examDetails.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
              />
            </div>

            <div className="mb-4">
              <label className="text-span text-dark font-medium block pb-2">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={examDetails.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-span text-dark font-medium block pb-2">
              Description
            </label>
            <textarea
              name="description"
              value={examDetails.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
              placeholder="Enter exam description"
            />
          </div>
        </div>
      )}

      {activeTab === "questions" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Questions</h3>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <RiAddLine className="mr-2 h-4 w-4" />
              Add Question
            </button>
          </div>

          {examDetails.questions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No questions added yet. Click "Add Question" to start.
            </div>
          ) : (
            <div className="space-y-6">
              {examDetails.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                      <h4 className="text-md font-medium text-gray-900">
                        Question {index + 1}
                      </h4>
                      <div className="flex items-center">
                        <label className="mr-2 text-sm text-gray-600">Points:</label>
                        <input
                          type="number"
                          min="0"
                          value={question.points || 0}
                          onChange={(e) => {
                            const newQuestions = [...examDetails.questions];
                            newQuestions[index] = {
                              ...question,
                              points: parseInt(e.target.value) || 0
                            };
                            setExamDetails({...examDetails, questions: newQuestions});
                          }}
                          className="w-20 px-2 py-1 border rounded"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBinLine className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="mb-4">
                      <label className="text-span text-dark font-medium block pb-2">
                        Question Type
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) => {
                          handleQuestionChange(
                            index,
                            "type",
                            e.target.value as
                              | "multi-choice"
                              | "fill-ins"
                              | "essay",
                          );
                        }}
                        className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
                      >
                        <option value="multi-choice">Multiple Choice</option>
                        <option value="fill-ins">Fill in the Blank</option>
                        <option value="essay">Essay</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="text-span text-dark font-medium block pb-2">
                        Question Text
                      </label>
                      <textarea
                        value={question.questionText}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "questionText",
                            e.target.value,
                          )
                        }
                        rows={3}
                        className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
                        placeholder="Enter your question here"
                      />
                    </div>

                    {question.type === "multi-choice" && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-span text-dark font-medium">
                            Answer Options
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddOption(index)}
                            className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Add Option
                          </button>
                        </div>

                        {question.options &&
                          question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className="flex items-center mb-2"
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}-answer`}
                                checked={question.questionAnswer === option}
                                onChange={() =>
                                  handleQuestionChange(
                                    index,
                                    "questionAnswer",
                                    option,
                                  )
                                }
                                className="mr-2"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(
                                    index,
                                    optIndex,
                                    e.target.value,
                                  )
                                }
                                className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md flex-1 leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
                              />
                              {question.options &&
                                question.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveOption(index, optIndex)
                                    }
                                    className="ml-2 text-red-500 hover:text-red-700"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                )}
                            </div>
                          ))}
                      </div>
                    )}

                    {question.type === "fill-ins" && (
                      <div className="mb-4">
                        <label className="text-span text-dark font-medium block pb-2">
                          Correct Answer
                        </label>
                        <input
                          type="text"
                          value={question.questionAnswer}
                          onChange={(e) =>
                            handleQuestionChange(
                              index,
                              "questionAnswer",
                              e.target.value,
                            )
                          }
                          className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full leading-5 h-10 transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
                          placeholder="Enter the correct answer"
                        />
                      </div>
                    )}

                    {question.type === "essay" && (
                      <div className="mb-4">
                        <label className="text-span text-dark font-medium block pb-2">
                          Model Answer (for grading reference)
                        </label>
                        <textarea
                          value={question.questionAnswer}
                          onChange={(e) =>
                            handleQuestionChange(
                              index,
                              "questionAnswer",
                              e.target.value,
                            )
                          }
                          className="placeholder:text-slate-400 placeholder:text-sm p-2 text-p text-dark border-2 rounded-md w-full transition duration-150 ease-out hover:border-primary hover:ease-in hover:drop-shadow-md outline-none focus:border-primary focus:transition-all"
                          placeholder="Enter a model answer for grading reference"
                          rows={4}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {examDetails.questions.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <p className="text-right text-gray-700">
                Total Points: {examDetails.questions.reduce((sum, q) => sum + (q.points || 0), 0)}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Save Exam
        </button>
      </div>
    </div>
  );
};

export default ExamForm;
