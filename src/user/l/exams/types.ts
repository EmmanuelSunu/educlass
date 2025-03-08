
export interface Exam {
  id: number;
  title: string;
  type: 'exam' | 'test' | 'assignment';
  duration: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  dueDate: string;
}

export interface ExamDetails extends Exam {
  description: string;
  questions: {
    id: number;
    questionText: string;
    questionAnswer: string;
  }[];
}
