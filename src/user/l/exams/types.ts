import { RubricCriteria } from '../../../data/exams/types';

export interface Exam {
  id: number;
  title: string;
  type: 'exam' | 'test' | 'assignment';
  duration: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  dueDate: string;
  description?: string;
  classId?: number;
  className?: string;
  questions?: Question[];
}

export interface ExamDetails {
  id: number;
  title: string;
  type: 'exam' | 'test' | 'assignment';
  duration: string;
  durationHours: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  dueDate: string;
  description: string;
  questions: Question[];
  classId?: number;
  className?: string;
}

export interface Question {
  id: string;
  type: 'essay' | 'multi-choice' | 'fill-ins';
  questionText: string;
  questionAnswer: string;
  options?: string[]; // Make this optional to accommodate different question types
  rubricCriteria?: RubricCriteria[]; // Only for essay type questions
}