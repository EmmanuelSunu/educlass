
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../contexts/ApiContext';
import { useApiError } from '../../../hooks/useApiError';
import ApiErrorAlert from '../../../components/ApiErrorAlert';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { FiCalendar, FiClock } from 'react-icons/fi';
import URLS from '../url';

interface Exam {
  id: number;
  title: string;
  type: string;
  dueDate: string;
  duration: string;
  status: string;
  description: string;
  className: string;
}

const ExamsList: React.FC = () => {
  const navigate = useNavigate();
  const { exams, isLoading, error: contextError, refreshExams } = useApi();
  const { error, handleError, hideError } = useApiError();
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (contextError) {
      handleError(contextError);
    }
  }, [contextError, handleError]);

  useEffect(() => {
    // Filter exams based on the selected status
    if (filterStatus === 'all') {
      setFilteredExams(exams);
    } else {
      setFilteredExams(exams.filter(exam => exam.status === filterStatus));
    }
  }, [exams, filterStatus]);

  const handleViewExam = (examId: number) => {
    navigate(URLS.EXAM_DETAILS(examId.toString()));
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading exams..." />;
  }

  return (
    <div className="w-full">
      <ApiErrorAlert error={error} onDismiss={hideError} />
      
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Exams</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-md text-sm ${
              filterStatus === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('scheduled')}
            className={`px-3 py-1 rounded-md text-sm ${
              filterStatus === 'scheduled' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1 rounded-md text-sm ${
              filterStatus === 'completed' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredExams.length === 0 ? (
        <div className="p-4 border rounded-md bg-gray-50 text-center">
          <p className="text-gray-500">No exams found.</p>
          <button 
            onClick={() => refreshExams()} 
            className="mt-2 text-blue-600 hover:underline"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((exam) => (
            <div 
              key={exam.id}
              className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewExam(exam.id)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold line-clamp-1">{exam.title}</h3>
                  <span 
                    className={`text-xs px-2 py-1 rounded-full ${
                      exam.status === 'scheduled' 
                        ? 'bg-blue-100 text-blue-700' 
                        : exam.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {exam.status === 'scheduled' ? 'Upcoming' : 
                      exam.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {exam.description}
                </p>
                
                <div className="mt-3 space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded mr-2">
                      {exam.className}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="mr-1" />
                    <span>{formatDate(exam.dueDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="mr-1" />
                    <span>{exam.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamsList;
