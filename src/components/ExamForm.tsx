import React, { useState, useEffect } from 'react';
import { RiAddLine, RiDeleteBinLine } from 'react-icons/ri';

export interface ExamDetails {
  id: number;
  title: string;
  type: 'exam' | 'test' | 'assignment';
  duration: string;
  durationHours?: number; // Added durationHours
  durationMinutes?: number; // Added durationMinutes
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  dueDate: string;
  description: string;
  questions: {
    id: number;
    questionText: string;
    questionAnswer: string;
  }[];
}

interface ExamFormProps {
  examDetails: ExamDetails;
  onExamChange: (examDetails: ExamDetails) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ExamForm: React.FC<ExamFormProps> = ({ 
  examDetails, 
  onExamChange, 
  onSave, 
  onCancel 
}) => {
  const [activeTab, setActiveTab] = useState('details');

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
          durationMinutes: minutes
        });
      } else {
        onExamChange({
          ...examDetails,
          durationHours: 1,
          durationMinutes: 0
        });
      }
    }
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onExamChange({
      ...examDetails,
      [name]: value
    });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;

    const updatedExam = {
      ...examDetails,
      [name]: numValue
    };

    const hours = name === 'durationHours' ? numValue : (examDetails.durationHours || 0);
    const minutes = name === 'durationMinutes' ? numValue : (examDetails.durationMinutes || 0);

    let durationStr = '';
    if (hours > 0) {
      durationStr += `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      durationStr += hours > 0 ? ` and ${minutes} minute${minutes !== 1 ? 's' : ''}` : `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    if (durationStr === '') {
      durationStr = '0 minutes';
    }

    updatedExam.duration = durationStr;
    onExamChange(updatedExam);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: examDetails.questions.length > 0 
        ? Math.max(...examDetails.questions.map(q => q.id)) + 1 
        : 1,
      questionText: '',
      questionAnswer: ''
    };

    onExamChange({
      ...examDetails,
      questions: [...examDetails.questions, newQuestion]
    });
  };

  const handleQuestionChange = (index: number, field: 'questionText' | 'questionAnswer', value: string) => {
    const updatedQuestions = [...examDetails.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };

    onExamChange({
      ...examDetails,
      questions: updatedQuestions
    });
  };

  const handleRemoveQuestion = (id: number) => {
    onExamChange({
      ...examDetails,
      questions: examDetails.questions.filter(q => q.id !== id)
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 border-b">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'details'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Exam Details
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'questions'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('questions')}
          >
            Questions
          </button>
        </div>
      </div>

      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={examDetails.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter exam title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={examDetails.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="exam">Exam</option>
                <option value="test">Test</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex space-x-4"> {/* Changed to flex for better layout */}
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Hours)</label>
                <input
                  type="number"
                  name="durationHours"
                  value={examDetails.durationHours || 0}
                  onChange={handleDurationChange}
                  min="0"
                  max="24"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  name="durationMinutes"
                  value={examDetails.durationMinutes || 0}
                  onChange={handleDurationChange}
                  min="0"
                  max="59"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={examDetails.dueDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={examDetails.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={examDetails.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={examDetails.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter exam description"
            />
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
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
                <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-900">Question {index + 1}</h4>
                    <button
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBinLine className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                      <textarea
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your question"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected Answer</label>
                      <textarea
                        value={question.questionAnswer}
                        onChange={(e) => handleQuestionChange(index, 'questionAnswer', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter expected answer"
                      />
                    </div>
                  </div>
                </div>
              ))}
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