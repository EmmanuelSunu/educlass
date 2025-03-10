
import { AxiosRequestConfig } from 'axios';

// Types for our API responses
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Base API configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

// Generic fetch function
export async function fetchFromApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// Exam-specific API methods
export const examsApi = {
  getAll: async () => {
    return fetchFromApi<ApiResponse<any[]>>('/exams');
  },
  
  getById: async (id: string | number) => {
    return fetchFromApi<ApiResponse<any>>(`/exams/${id}`);
  },
  
  createExam: async (examData: any) => {
    return fetchFromApi<ApiResponse<any>>('/exams', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  },
  
  updateExam: async (id: string | number, examData: any) => {
    return fetchFromApi<ApiResponse<any>>(`/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(examData),
    });
  },
  
  deleteExam: async (id: string | number) => {
    return fetchFromApi<ApiResponse<any>>(`/exams/${id}`, {
      method: 'DELETE',
    });
  }
};

// Results-specific API methods
export const resultsApi = {
  getStudentResults: async (studentId: string | number) => {
    return fetchFromApi<ApiResponse<any[]>>(`/results/student/${studentId}`);
  },
  
  getExamResults: async (examId: string | number) => {
    return fetchFromApi<ApiResponse<any>>(`/results/exam/${examId}`);
  },
  
  submitExam: async (examId: string | number, answers: any) => {
    return fetchFromApi<ApiResponse<any>>(`/exams/${examId}/submit`, {
      method: 'POST',
      body: JSON.stringify(answers),
    });
  }
};
