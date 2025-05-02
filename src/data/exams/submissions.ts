export interface StudentSubmission {
  id: number;
  studentId: number;
  studentName: string;
  examId: number;
  submittedAt: string;
  answers: Answer[];
  totalScore: number;
  status: "pending" | "graded";
}

export interface Answer {
  questionId: string;
  answer: string;
  score: number;
  feedback: string;
}

// Mock data - replace with actual API calls
const mockSubmissions: StudentSubmission[] = [
  {
    id: 1,
    studentId: 1,
    studentName: "John Doe",
    examId: 1,
    submittedAt: "2024-03-20T10:30:00",
    answers: [
      {
        questionId: "q1",
        answer: "Lorem ipsum dolor sit amet",
        score: 0,
        feedback: "",
      },
      {
        questionId: "q2",
        answer: "Option B",
        score: 0,
        feedback: "",
      },
    ],
    totalScore: 0,
    status: "pending",
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Jane Smith",
    examId: 1,
    submittedAt: "2024-03-20T11:15:00",
    answers: [
      {
        questionId: "q1",
        answer: "Consectetur adipiscing elit",
        score: 0,
        feedback: "",
      },
      {
        questionId: "q2",
        answer: "Option A",
        score: 0,
        feedback: "",
      },
    ],
    totalScore: 0,
    status: "pending",
  },
];

export const getSubmissionsForExam = (examId: number): StudentSubmission[] => {
  return mockSubmissions.filter(submission => submission.examId === examId);
};

export const updateSubmission = (submission: StudentSubmission): void => {
  // In a real application, this would make an API call
  const index = mockSubmissions.findIndex(s => s.id === submission.id);
  if (index !== -1) {
    mockSubmissions[index] = submission;
  }
}; 