export interface RubricCriteria {
  name: string;
  value: number;
  description: string;
}

export interface Question {
  id: string;
  type: "essay" | "multi-choice" | "fill-ins";
  points: number;
  questionText: string;
  questionAnswer: string;
  options?: string[];
  rubricCriteria?: RubricCriteria[]; // Only for essay type questions
}

export interface Exam {
  id: number;
  title: string;
  type: "exam" | "test" | "assignment";
  duration: string;
  durationHours: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "in-progress";
  dueDate: string;
  description: string;
  classId: number;
  className: string;
  questions: Question[];
}

export interface Student {
  id: string;
  name: string;
}

export interface Class {
  id: string;
  level: string;
  program: string;
  students: Student[];
}

export interface ClassDetails {
  name: string;
  duration: string;
  level: string;
  semester: string;
  lecturer: string;
  description: string;
}

export interface Schedule {
  id: number;
  type: "class" | "examination" | "test" | "meeting";
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  location: string;
  classId: number;
}

export interface StudentData {
  id: string;
  name: string;
  email: string;
  program: string;
  year: string;
  classIds: number[];
} 