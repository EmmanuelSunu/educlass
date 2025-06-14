import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { type Course } from './types';
import { courseService } from './service';
import { useAuth } from '../auth/context';

interface CourseState {
  courses: Course[];
  enrolledCourses: Course[];
  loading: boolean;
  error: string | null;
}

interface CourseContextType extends CourseState {
  loadCourses: () => Promise<void>;
  loadEnrolledCourses: (studentId: number) => Promise<void>;
  loadLecturerCourses: (lecturerId: number) => Promise<void>;
  clearError: () => void;
}

const initialState: CourseState = {
  courses: [],
  enrolledCourses: [],
  loading: false,
  error: null
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

type CourseAction =
  | { type: 'LOAD_COURSES_START' }
  | { type: 'LOAD_COURSES_SUCCESS'; payload: Course[] }
  | { type: 'LOAD_COURSES_FAILURE'; payload: string }
  | { type: 'LOAD_ENROLLED_COURSES_SUCCESS'; payload: Course[] }
  | { type: 'LOAD_LECTURER_COURSES_SUCCESS'; payload: Course[] }
  | { type: 'CLEAR_ERROR' };

function courseReducer(state: CourseState, action: CourseAction): CourseState {
  switch (action.type) {
    case 'LOAD_COURSES_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOAD_COURSES_SUCCESS':
      return {
        ...state,
        loading: false,
        courses: action.payload,
        error: null
      };
    case 'LOAD_COURSES_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'LOAD_ENROLLED_COURSES_SUCCESS':
      return {
        ...state,
        loading: false,
        enrolledCourses: action.payload,
        error: null
      };
    case 'LOAD_LECTURER_COURSES_SUCCESS':
      return {
        ...state,
        loading: false,
        courses: action.payload,
        error: null
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

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(courseReducer, initialState);
  const { user } = useAuth();

  const loadCourses = useCallback(async () => {
    try {
      dispatch({ type: 'LOAD_COURSES_START' });
      const courses = await courseService.getCourses();
      dispatch({ type: 'LOAD_COURSES_SUCCESS', payload: courses });
    } catch (error) {
      dispatch({ 
        type: 'LOAD_COURSES_FAILURE', 
        payload: 'Failed to load courses' 
      });
    }
  }, []);

  const loadEnrolledCourses = useCallback(async (studentId: number) => {
    try {
      dispatch({ type: 'LOAD_COURSES_START' });
      const courses = await courseService.getCoursesByStudentId(studentId);
      dispatch({ type: 'LOAD_ENROLLED_COURSES_SUCCESS', payload: courses });
    } catch (error) {
      dispatch({ 
        type: 'LOAD_COURSES_FAILURE', 
        payload: 'Failed to load enrolled courses' 
      });
    }
  }, []);

  const loadLecturerCourses = useCallback(async (lecturerId: number) => {
    try {
      dispatch({ type: 'LOAD_COURSES_START' });
      const courses = await courseService.getCoursesByLecturerId(lecturerId);
      dispatch({ type: 'LOAD_LECTURER_COURSES_SUCCESS', payload: courses });
    } catch (error) {
      dispatch({ 
        type: 'LOAD_COURSES_FAILURE', 
        payload: 'Failed to load lecturer courses' 
      });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Load courses based on user role
  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        loadEnrolledCourses(user.id);
      } else if (user.role === 'lecturer') {
        loadLecturerCourses(user.id);
      } else {
        loadCourses();
      }
    }
  }, [user, loadCourses, loadEnrolledCourses, loadLecturerCourses]);

  const value = {
    ...state,
    loadCourses,
    loadEnrolledCourses,
    loadLecturerCourses,
    clearError
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
} 