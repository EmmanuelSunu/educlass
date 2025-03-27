import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { type Exam, type ExamSubmission } from './types';
import { getExams, getExamById, getExamSubmissionsByStudentId, getSubmissionsForExam } from './service';
import { useAuth } from '../auth/context';
import { useCourse } from '../course/context';

interface ExamState {
  exams: Exam[];
  studentExams: Exam[];
  examSubmissions: ExamSubmission[];
  currentExam: Exam | null;
  loading: boolean;
  error: string | null;
}

interface ExamContextType extends ExamState {
  loadExams: () => Promise<void>;
  loadStudentExams: (studentId: number) => Promise<void>;
  loadExamById: (examId: number) => Promise<void>;
  loadExamSubmissions: (examId: number) => Promise<void>;
  loadStudentSubmissions: (studentId: number) => Promise<void>;
  clearError: () => void;
}

const initialState: ExamState = {
  exams: [],
  studentExams: [],
  examSubmissions: [],
  currentExam: null,
  loading: false,
  error: null
};

const ExamContext = createContext<ExamContextType | undefined>(undefined);

type ExamAction =
  | { type: 'LOAD_EXAMS_START' }
  | { type: 'LOAD_EXAMS_SUCCESS'; payload: Exam[] }
  | { type: 'LOAD_STUDENT_EXAMS_SUCCESS'; payload: Exam[] }
  | { type: 'LOAD_EXAM_BY_ID_SUCCESS'; payload: Exam }
  | { type: 'LOAD_EXAM_SUBMISSIONS_SUCCESS'; payload: ExamSubmission[] }
  | { type: 'LOAD_STUDENT_SUBMISSIONS_SUCCESS'; payload: ExamSubmission[] }
  | { type: 'LOAD_EXAMS_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' };

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case 'LOAD_EXAMS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOAD_EXAMS_SUCCESS':
      return {
        ...state,
        loading: false,
        exams: action.payload,
        error: null
      };
    case 'LOAD_STUDENT_EXAMS_SUCCESS':
      return {
        ...state,
        loading: false,
        studentExams: action.payload,
        error: null
      };
    case 'LOAD_EXAM_BY_ID_SUCCESS':
      return {
        ...state,
        loading: false,
        currentExam: action.payload,
        error: null
      };
    case 'LOAD_EXAM_SUBMISSIONS_SUCCESS':
      return {
        ...state,
        loading: false,
        examSubmissions: action.payload,
        error: null
      };
    case 'LOAD_STUDENT_SUBMISSIONS_SUCCESS':
      return {
        ...state,
        loading: false,
        examSubmissions: action.payload,
        error: null
      };
    case 'LOAD_EXAMS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
}

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(examReducer, initialState);
  const { user } = useAuth();
  const { enrolledCourses } = useCourse();

  const loadExams = useCallback(async () => {
    try {
      dispatch({ type: 'LOAD_EXAMS_START' });
      const exams = await getExams();
      dispatch({ type: 'LOAD_EXAMS_SUCCESS', payload: exams });
    } catch (error) {
      dispatch({ 
        type: 'LOAD_EXAMS_FAILURE', 
        payload: 'Failed to load exams' 
      });
    }
  }, []);

  const loadStudentExams = useCallback(async (studentId: number) => {
    try {
      dispatch({ type: 'LOAD_EXAMS_START' });
      const exams = await getExams();
      // Filter exams based on enrolled courses
      const studentExams = exams.filter(exam => 
        enrolledCourses.some(course => course.id === exam.classId)
      );
      dispatch({ type: 'LOAD_STUDENT_EXAMS_SUCCESS', payload: studentExams });
    } catch (error) {
      dispatch({ 
        type: 'LOAD_EXAMS_FAILURE', 
        payload: 'Failed to load student exams' 
      });
    }
  }, [enrolledCourses]);

  const loadExamById = useCallback(async (examId: number) => {
    try {
      dispatch({ type: 'LOAD_EXAMS_START' });
      const exam = await getExamById(examId);
      if (exam) {
        dispatch({ type: 'LOAD_EXAM_BY_ID_SUCCESS', payload: exam });
      }
    } catch (error) {
      dispatch({ 
        type: 'LOAD_EXAMS_FAILURE', 
        payload: 'Failed to load exam details' 
      });
    }
  }, []);

  const loadExamSubmissions = useCallback(async (examId: number) => {
    try {
      dispatch({ type: 'LOAD_EXAMS_START' });
      const submissions = await getSubmissionsForExam(examId);
      dispatch({ type: 'LOAD_EXAM_SUBMISSIONS_SUCCESS', payload: submissions });
    } catch (error) {
      dispatch({ 
        type: 'LOAD_EXAMS_FAILURE', 
        payload: 'Failed to load exam submissions' 
      });
    }
  }, []);

  const loadStudentSubmissions = useCallback(async (studentId: number) => {
    try {
      dispatch({ type: 'LOAD_EXAMS_START' });
      const submissions = await getExamSubmissionsByStudentId(studentId);
      dispatch({ type: 'LOAD_STUDENT_SUBMISSIONS_SUCCESS', payload: submissions });
    } catch (error) {
      dispatch({ 
        type: 'LOAD_EXAMS_FAILURE', 
        payload: 'Failed to load student submissions' 
      });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Load exams based on user role
  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        loadStudentExams(user.id);
        loadStudentSubmissions(user.id);
      } else {
        loadExams();
      }
    }
  }, [user, loadExams, loadStudentExams, loadStudentSubmissions]);

  const value = {
    ...state,
    loadExams,
    loadStudentExams,
    loadExamById,
    loadExamSubmissions,
    loadStudentSubmissions,
    clearError
  };

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
} 