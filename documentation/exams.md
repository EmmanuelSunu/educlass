# Exam System Documentation

## Core Data Types

### Exam
```typescript
interface Exam {
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
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
```

### Question
```typescript
interface Question {
  id: string;
  examId: number;
  type: "essay" | "multi-choice" | "fill-ins";
  questionText: string;
  points: number;
  // For essay questions
  modelAnswer?: string;
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
```

### RubricCriteria
```typescript
interface RubricCriteria {
  id: string;
  questionId: string;
  name: string;
  value: number;
  description: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
```

### Submission
```typescript
interface Submission {
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
```

### SubmissionAnswer
```typescript
interface SubmissionAnswer {
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
```

### RubricScore
```typescript
interface RubricScore {
  id: string;
  submissionAnswerId: string;
  rubricCriteriaId: string;
  score: number;
  feedback?: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
```

## Data Structure Requirements

1. **Exam Types**:
   - Exams can be either "exam" or "assignment"
   - Exams have a fixed duration and time window
   - Total points must be calculated from question points

2. **Question Types**:
   - Essay questions require model answers and rubric criteria
   - Multi-choice questions have options with IDs and one correct answer
   - Fill-in questions have a single correct answer
   - Each question type has appropriate scoring mechanisms

3. **Rubric Criteria**:
   - Only applicable to essay questions
   - Each question's criteria must total 100 points
   - Criteria names are fixed:
     - Content Relevance
     - Structure and Organization
     - Language and Style
     - Critical Thinking and Analysis
     - Originality and Paraphrasing

4. **Submissions**:
   - Track student attempts with start and end times
   - Store individual answers for each question
   - Record scores and feedback at both question and rubric criteria levels

## Example Usage

### Creating an Exam
```typescript
const exam: Exam = {
  id: 1,
  title: "Introduction to Programming Final Exam",
  type: "exam",
  description: "Comprehensive final exam covering all topics from the semester",
  classId: 1,
  className: "Computer Science 101",
  dueDate: "2024-04-15",
  startTime: "09:00",
  endTime: "11:00",
  durationHours: 2,
  durationMinutes: 0,
  duration: "2 hours",
  status: "upcoming",
  totalPoints: 100,
  createdAt: "2024-03-20T10:00:00Z",
  updatedAt: "2024-03-20T10:00:00Z"
};
```

### Adding Questions
```typescript
const questions: Question[] = [
  {
    id: "q1",
    examId: 1,
    type: "essay",
    questionText: "Explain the concept of inheritance in OOP.",
    points: 20,
    modelAnswer: "Inheritance is a fundamental OOP concept...",
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z"
  },
  {
    id: "q2",
    examId: 1,
    type: "multi-choice",
    questionText: "Which of the following is NOT a principle of OOP?",
    points: 10,
    options: [
      { id: "opt1", text: "Encapsulation" },
      { id: "opt2", text: "Inheritance" },
      { id: "opt3", text: "Polymorphism" },
      { id: "opt4", text: "Sequential Processing" }
    ],
    correctAnswerId: "opt4",
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z"
  }
];
```

### Recording a Submission
```typescript
const submission: Submission = {
  id: "sub1",
  examId: 1,
  studentId: "student1",
  startTime: "2024-03-20T09:00:00Z",
  endTime: "2024-03-20T10:45:00Z",
  status: "submitted",
  totalScore: 85,
  createdAt: "2024-03-20T10:45:00Z",
  updatedAt: "2024-03-20T10:45:00Z"
};

const submissionAnswers: SubmissionAnswer[] = [
  {
    id: "sa1",
    submissionId: "sub1",
    questionId: "q1",
    answer: "Inheritance is a fundamental concept...",
    score: 18,
    feedback: "Good explanation with clear examples.",
    createdAt: "2024-03-20T10:45:00Z",
    updatedAt: "2024-03-20T10:45:00Z"
  },
  {
    id: "sa2",
    submissionId: "sub1",
    questionId: "q2",
    selectedOptionId: "opt4",
    score: 10,
    feedback: "Correct answer",
    createdAt: "2024-03-20T10:45:00Z",
    updatedAt: "2024-03-20T10:45:00Z"
  }
];
``` 