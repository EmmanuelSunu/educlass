
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { examsApi, resultsApi } from '../services/api';

// Define context types
interface ApiContextType {
  exams: any[];
  isLoading: boolean;
  error: string | null;
  refreshExams: () => Promise<void>;
  getExamById: (id: number | string) => any;
}

// Create context with default values
const ApiContext = createContext<ApiContextType>({
  exams: [],
  isLoading: false,
  error: null,
  refreshExams: async () => {},
  getExamById: () => null,
});

// Create provider component
export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all exams
  const refreshExams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await examsApi.getAll();
      if (response.success) {
        setExams(response.data);
      } else {
        setError(response.message || 'Failed to fetch exams');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Get exam by ID
  const getExamById = (id: number | string) => {
    return exams.find(exam => exam.id === Number(id));
  };

  // Load exams when the component mounts
  useEffect(() => {
    refreshExams();
  }, []);

  // Create context value
  const contextValue: ApiContextType = {
    exams,
    isLoading,
    error,
    refreshExams,
    getExamById,
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook for using the API context
export const useApi = () => useContext(ApiContext);
