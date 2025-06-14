import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { type Schedule } from './types';
import { scheduleService } from './service';
import { useAuth } from '../auth/context';
import { useCourse } from '../course/context';
import { useExam } from '../exams/context';

interface ScheduleState {
  schedules: Schedule[];
  courseSchedules: Schedule[];
  examSchedules: Schedule[];
  loading: boolean;
  error: string | null;
}

interface ScheduleContextType extends ScheduleState {
  loadSchedules: () => Promise<void>;
  loadCourseSchedules: (courseId: number) => Promise<void>;
  loadExamSchedules: (courseId: number) => Promise<void>;
  addSchedule: (schedule: Schedule) => Promise<void>;
  updateSchedule: (schedule: Schedule) => Promise<void>;
  deleteSchedule: (scheduleId: string) => Promise<void>;
  clearError: () => void;
}

const initialState: ScheduleState = {
  schedules: [],
  courseSchedules: [],
  examSchedules: [],
  loading: false,
  error: null
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

type ScheduleAction =
  | { type: 'LOAD_SCHEDULES_START' }
  | { type: 'LOAD_SCHEDULES_SUCCESS'; payload: Schedule[] }
  | { type: 'LOAD_COURSE_SCHEDULES_SUCCESS'; payload: Schedule[] }
  | { type: 'LOAD_EXAM_SCHEDULES_SUCCESS'; payload: Schedule[] }
  | { type: 'ADD_SCHEDULE_SUCCESS'; payload: Schedule }
  | { type: 'UPDATE_SCHEDULE_SUCCESS'; payload: Schedule }
  | { type: 'DELETE_SCHEDULE_SUCCESS'; payload: string }
  | { type: 'LOAD_SCHEDULES_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' };

function scheduleReducer(state: ScheduleState, action: ScheduleAction): ScheduleState {
  switch (action.type) {
    case 'LOAD_SCHEDULES_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOAD_SCHEDULES_SUCCESS':
      return {
        ...state,
        loading: false,
        schedules: action.payload,
        error: null
      };
    case 'LOAD_COURSE_SCHEDULES_SUCCESS':
      return {
        ...state,
        loading: false,
        courseSchedules: action.payload,
        error: null
      };
    case 'LOAD_EXAM_SCHEDULES_SUCCESS':
      return {
        ...state,
        loading: false,
        examSchedules: action.payload,
        error: null
      };
    case 'ADD_SCHEDULE_SUCCESS':
      return {
        ...state,
        loading: false,
        schedules: [...state.schedules, action.payload],
        error: null
      };
    case 'UPDATE_SCHEDULE_SUCCESS':
      return {
        ...state,
        loading: false,
        schedules: state.schedules.map(schedule => 
          schedule.id === action.payload.id ? action.payload : schedule
        ),
        error: null
      };
    case 'DELETE_SCHEDULE_SUCCESS':
      return {
        ...state,
        loading: false,
        schedules: state.schedules.filter(schedule => schedule.id !== action.payload),
        error: null
      };
    case 'LOAD_SCHEDULES_FAILURE':
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

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);
  const { user } = useAuth();
  const { enrolledCourses } = useCourse();
  const { studentExams } = useExam();

  const loadSchedules = useCallback(async () => {
    try {
      dispatch({ type: 'LOAD_SCHEDULES_START' });
      const schedules = await scheduleService.getSchedules();
      dispatch({ type: 'LOAD_SCHEDULES_SUCCESS', payload: schedules });
    } catch (error) {
      dispatch({ 
        type: 'LOAD_SCHEDULES_FAILURE', 
        payload: 'Failed to load schedules' 
      });
    }
  }, []);

  const loadCourseSchedules = useCallback(async (courseId: number) => {
    try {
      dispatch({ type: 'LOAD_SCHEDULES_START' });
      const schedules = await scheduleService.getSchedulesByCourseId(courseId);
      dispatch({ type: 'LOAD_COURSE_SCHEDULES_SUCCESS', payload: schedules });
    } catch (error) {
      dispatch({ 
        type: 'LOAD_SCHEDULES_FAILURE', 
        payload: 'Failed to load course schedules' 
      });
    }
  }, []);

  const loadExamSchedules = useCallback(async (courseId: number) => {
    try {
      dispatch({ type: 'LOAD_SCHEDULES_START' });
      // Convert exams to schedule format
      const examSchedules: Schedule[] = studentExams
        .filter(exam => exam.classId === courseId)
        .map(exam => ({
          id: exam.id.toString(),
          title: exam.title,
          type: exam.type === "exam" ? "examination" : "class",
          date: exam.dueDate,
          startTime: exam.startTime,
          endTime: exam.endTime,
          location: `${exam.className} Exam Hall`,
          isRecurring: false,
          courseId: exam.classId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      dispatch({ type: 'LOAD_EXAM_SCHEDULES_SUCCESS', payload: examSchedules });
    } catch (error) {
      dispatch({ 
        type: 'LOAD_SCHEDULES_FAILURE', 
        payload: 'Failed to load exam schedules' 
      });
    }
  }, [studentExams]);

  const addSchedule = useCallback(async (schedule: Schedule) => {
    try {
      dispatch({ type: 'LOAD_SCHEDULES_START' });
      const newSchedule = await scheduleService.createSchedule(schedule);
      dispatch({ type: 'ADD_SCHEDULE_SUCCESS', payload: newSchedule });
    } catch (error) {
      dispatch({ 
        type: 'LOAD_SCHEDULES_FAILURE', 
        payload: 'Failed to add schedule' 
      });
    }
  }, []);

  const updateSchedule = useCallback(async (schedule: Schedule) => {
    try {
      dispatch({ type: 'LOAD_SCHEDULES_START' });
      const updatedSchedule = await scheduleService.updateSchedule(schedule.id, schedule);
      if (updatedSchedule) {
        dispatch({ type: 'UPDATE_SCHEDULE_SUCCESS', payload: updatedSchedule });
      } else {
        dispatch({ 
          type: 'LOAD_SCHEDULES_FAILURE', 
          payload: 'Failed to update schedule' 
        });
      }
    } catch (error) {
      dispatch({ 
        type: 'LOAD_SCHEDULES_FAILURE', 
        payload: 'Failed to update schedule' 
      });
    }
  }, []);

  const deleteSchedule = useCallback(async (scheduleId: string) => {
    try {
      dispatch({ type: 'LOAD_SCHEDULES_START' });
      await scheduleService.deleteSchedule(scheduleId);
      dispatch({ type: 'DELETE_SCHEDULE_SUCCESS', payload: scheduleId });
    } catch (error) {
      dispatch({ 
        type: 'LOAD_SCHEDULES_FAILURE', 
        payload: 'Failed to delete schedule' 
      });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Load schedules based on user role and enrolled courses
  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        // Load schedules for all enrolled courses
        enrolledCourses.forEach(course => {
          loadCourseSchedules(course.id);
          loadExamSchedules(course.id);
        });
      } else {
        loadSchedules();
      }
    }
  }, [user, enrolledCourses, loadSchedules, loadCourseSchedules, loadExamSchedules]);

  const value = {
    ...state,
    loadSchedules,
    loadCourseSchedules,
    loadExamSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    clearError
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
} 