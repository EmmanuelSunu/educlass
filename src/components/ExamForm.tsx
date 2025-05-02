import React, { useState, useEffect } from "react";
import type { Exam, Question, RubricCriteria } from "../data/exams/types";
import { courseService } from "../data/course/service";
import type { Course } from "../data/course/types";
import {
  calculateDuration,
  formatTimeString,
  isValidTimeFormat
} from "../utils/exam";

interface ExamFormProps {
  examDetails?: Partial<Exam>;
  onExamChange: (details: Partial<Exam>) => void;
  onQuestionsChange: (questions: Question[]) => void;
  onRubricCriteriaChange: (criteria: RubricCriteria[]) => void;
}

const defaultRubricCriteria: RubricCriteria[] = [
  {
    name: "Content Relevance",
    value: 20,
    description: "How well the answer addresses the question and covers key concepts",
  },
  {
    name: "Structure and Organization",
    value: 20,
    description: "Logical flow and organization of the response",
  },
  {
    name: "Language and Style",
    value: 20,
    description: "Clarity of expression and appropriate technical language",
  },
  {
    name: "Critical Thinking and Analysis",
    value: 20,
    description: "Depth of analysis and evaluation of concepts",
  },
  {
    name: "Originality and Paraphrasing",
    value: 20,
    description: "Original expression and proper paraphrasing of concepts",
  },
];

export default function ExamForm({
  examDetails,
  onExamChange,
  onQuestionsChange,
  onRubricCriteriaChange,
}: ExamFormProps) {
  const [formData, setFormData] = useState<Partial<Exam>>(
    examDetails || {
      title: "",
      type: "exam",
      description: "",
      classId: 1,
      className: "",
      dueDate: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "11:00",
      durationHours: 2,
      durationMinutes: 0,
      duration: "2 hours",
      questions: [],
    }
  );

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [timeError, setTimeError] = useState({
    startTime: false,
    endTime: false,
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courseData = await courseService.getCourses();
        setCourses(courseData);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    if (examDetails) {
      setFormData(examDetails);
    }
  }, [examDetails]);

  useEffect(() => {
    // Recalculate duration string whenever hours or minutes change
    const durationString = calculateDuration(
      formData.durationHours || 0,
      formData.durationMinutes || 0
    );
    setFormData((prev: Partial<Exam>) => ({ ...prev, duration: durationString }));
  }, [formData.durationHours, formData.durationMinutes]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let newValue: string | number = value;

    // Handle time inputs
    if (name === "startTime" || name === "endTime") {
      if (!isValidTimeFormat(value)) {
        setTimeError((prev: { startTime: boolean; endTime: boolean }) => ({ ...prev, [name]: true }));
        return;
      }
      setTimeError((prev: { startTime: boolean; endTime: boolean }) => ({ ...prev, [name]: false }));
      newValue = formatTimeString(value);
    }
    // Handle numeric inputs
    else if (name === "durationHours" || name === "durationMinutes") {
      newValue = parseInt(value) || 0;
      if (name === "durationMinutes" && (newValue as number) >= 60) {
        newValue = 59;
      }
    }

    setFormData((prev: Partial<Exam>) => ({ ...prev, [name]: newValue }));
    onExamChange({ ...formData, [name]: newValue });
  };

  const handleDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "hours" | "minutes"
  ) => {
    const value = parseInt(e.target.value) || 0;
    const name = type === "hours" ? "durationHours" : "durationMinutes";
    
    if (type === "minutes" && value >= 60) {
      setFormData((prev: Partial<Exam>) => ({ ...prev, [name]: 59 }));
      onExamChange({ ...formData, [name]: 59 });
    } else {
      setFormData((prev: Partial<Exam>) => ({ ...prev, [name]: value }));
      onExamChange({ ...formData, [name]: value });
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: String(
        (formData.questions?.length || 0) > 0
          ? Math.max(...(formData.questions || []).map((q: Question) => Number(q.id))) + 1
          : 1,
      ),
      type: "essay",
      questionText: "",
      points: 0,
      questionAnswer: "",
      rubricCriteria: [...defaultRubricCriteria],
    };

    onQuestionsChange([...(formData.questions || []), newQuestion]);
  };

  const handleAddOption = (index: number) => {
    const updatedQuestions = [...(formData.questions || [])];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      options: [...(updatedQuestions[index].options || []), `Option ${(updatedQuestions[index].options?.length || 0) + 1}`],
    };
    onQuestionsChange(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...(formData.questions || [])];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options?.filter((_, i) => i !== optionIndex);
    onQuestionsChange(updatedQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const updatedQuestions = [...(formData.questions || [])];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options[optionIndex] = value;
    }
    onQuestionsChange(updatedQuestions);
  };

  const handleQuestionChange = (
    questionIndex: number,
    field: keyof Question,
    value: string | number,
  ) => {
    const updatedQuestions = [...(formData.questions || [])];

    if (field === "type") {
      // Reset type-specific fields when changing question type
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        type: value as Question["type"],
        options: value === "multi-choice" ? ["Option 1"] : undefined,
        questionAnswer: value === "essay" ? "" : "",
        rubricCriteria: value === "essay" ? [...defaultRubricCriteria] : undefined,
      };
    } else {
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [field]: value,
      };
    }

    onQuestionsChange(updatedQuestions);
  };

  const handleRemoveQuestion = (id: string) => {
    onQuestionsChange(formData.questions?.filter((q: Question) => q.id !== id) || []);
  };

  const handleRubricCriteriaChange = (questionIndex: number, criteriaIndex: number, value: number) => {
    const updatedQuestions = [...(formData.questions || [])];
    const question = updatedQuestions[questionIndex];
    
    if (question.rubricCriteria) {
      question.rubricCriteria[criteriaIndex] = {
        ...question.rubricCriteria[criteriaIndex],
        value,
      };
      
      onRubricCriteriaChange(question.rubricCriteria);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        >
          <option value="exam">Exam</option>
          <option value="test">Test</option>
          <option value="assignment">Assignment</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Class</label>
        <select
          name="className"
          value={formData.className}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          required
          disabled={loading}
        >
          <option value="">Select a class</option>
          {courses.map((course) => (
            <option key={course.id} value={course.name}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary sm:text-sm ${
              timeError.startTime
                ? "border-red-300 focus:border-red-500"
                : "border-gray-300 focus:border-primary"
            }`}
            required
          />
          {timeError.startTime && (
            <p className="mt-1 text-sm text-red-600">Invalid time format</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary sm:text-sm ${
              timeError.endTime
                ? "border-red-300 focus:border-red-500"
                : "border-gray-300 focus:border-primary"
            }`}
            required
          />
          {timeError.endTime && (
            <p className="mt-1 text-sm text-red-600">Invalid time format</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Duration</label>
        <div className="mt-1 flex space-x-4">
          <div className="flex-1">
            <input
              type="number"
              name="durationHours"
              value={formData.durationHours}
              onChange={(e) => handleDurationChange(e, "hours")}
              min="0"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
            <span className="text-sm text-gray-500">Hours</span>
          </div>
          <div className="flex-1">
            <input
              type="number"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={(e) => handleDurationChange(e, "minutes")}
              min="0"
              max="59"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
            <span className="text-sm text-gray-500">Minutes</span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Total Duration: {formData.duration}
        </p>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Questions</h3>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Question
          </button>
        </div>

        {(formData.questions?.length || 0) === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No questions added yet. Click "Add Question" to start.
          </div>
        ) : (
          <div className="space-y-6">
            {formData.questions?.map((question, index) => (
              <div
                key={question.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Question {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(question.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Question Text
                    </label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) =>
                        handleQuestionChange(index, "questionText", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) =>
                          handleQuestionChange(index, "type", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      >
                        <option value="essay">Essay</option>
                        <option value="multi-choice">Multiple Choice</option>
                        <option value="fill-ins">Fill in the Blanks</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Points
                      </label>
                      <input
                        type="number"
                        value={question.points}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "points",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        min="0"
                      />
                    </div>
                  </div>

                  {question.type === "essay" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Model Answer
                      </label>
                      <textarea
                        value={question.questionAnswer}
                        onChange={(e) =>
                          handleQuestionChange(index, "questionAnswer", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        rows={4}
                      />
                    </div>
                  )}

                  {question.type === "multi-choice" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        {question.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(index, optionIndex, e.target.value)
                              }
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.questionAnswer === option}
                              onChange={() =>
                                handleQuestionChange(
                                  index,
                                  "questionAnswer",
                                  option
                                )
                              }
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(index, optionIndex)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddOption(index)}
                          className="text-primary hover:text-primary-dark"
                        >
                          Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  {question.type === "fill-ins" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Correct Answer
                      </label>
                      <input
                        type="text"
                        value={question.questionAnswer}
                        onChange={(e) =>
                          handleQuestionChange(index, "questionAnswer", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                  )}

                  {question.type === "essay" && question.rubricCriteria && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rubric Criteria
                      </label>
                      <div className="space-y-2">
                        {question.rubricCriteria.map((criteria, criteriaIndex) => (
                          <div key={criteriaIndex} className="flex items-center space-x-2">
                            <span className="flex-1 text-sm text-gray-700">
                              {criteria.name}
                            </span>
                            <input
                              type="number"
                              value={criteria.value}
                              onChange={(e) =>
                                handleRubricCriteriaChange(
                                  index,
                                  criteriaIndex,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                              min="0"
                              max="100"
                            />
                            <span className="text-sm text-gray-500">%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {(formData.questions?.length || 0) > 0 && (
          <div className="mt-6 pt-4 border-t">
            <p className="text-right text-gray-700">
              Total Points: {(formData.questions || []).reduce((sum, q) => sum + (q.points || 0), 0)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}