export interface Exam {
  id: number;
  title: string;
  type: "exam" | "assignment";
  description: string;
  classId: number;
  className: string;
  dueDate: string; // ISO date format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  durationHours: number;
  durationMinutes: number;
  duration: string; // Formatted duration string
  status: "upcoming" | "ongoing" | "completed";
  totalPoints: number;
  questions: Question[];
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface Question {
  id: string;
  examId: number;
  type: "essay" | "multi-choice" | "fill-ins";
  questionText: string;
  points: number;
  // For essay questions
  modelAnswer?: string;
  rubricCriteria?: RubricCriteria[];
  // For multi-choice questions
  options?: {
    id: string;
    text: string;
  }[];
  correctAnswerId?: string; // ID of the correct option for multi-choice
  // For fill-in questions
  correctAnswer?: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface RubricCriteria {
  id: string;
  questionId: string;
  name: string;
  value: number;
  description: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface Submission {
  id: string;
  examId: number;
  studentId: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  status: "submitted";
  totalScore: number;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface SubmissionAnswer {
  id: string;
  submissionId: string;
  questionId: string;
  // For essay and fill-in questions
  answer?: string;
  // For multi-choice questions
  selectedOptionId?: string;
  score: number;
  feedback?: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface RubricScore {
  id: string;
  submissionAnswerId: string;
  rubricCriteriaId: string;
  score: number;
  feedback?: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
} 