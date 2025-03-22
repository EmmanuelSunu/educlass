declare module '../../../data' {
  export interface Question {
    id: string;
    type: "essay" | "multi-choice" | "fill-ins";
    points: number;
    questionText: string;
    questionAnswer: string;
    options?: string[];
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
    duration: string;
    level: string;
    semester: string;
    lecturer: string;
    description: string;
  }

  export interface StudentData {
    id: string;
    name: string;
    email: string;
    program: string;
    year: string;
    classIds: number[];
  }

  export const exams: Exam[];
  export const classes: Class[];
  export const classDetails: Record<number, ClassDetails>;
  export const studentData: StudentData;
  export const studentClassIds: number[];
} 