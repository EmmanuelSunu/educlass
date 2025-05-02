# Student Documentation

This documentation covers the student features, data structures, and flows in the EduClass application.

## Table of Contents
1. [Data Types](#data-types)
2. [Features](#features)
3. [API Requirements](#api-requirements)
4. [State Management](#state-management)

## Data Types

### Student
```typescript
interface StudentData {
  id: string;
  name: string;
  email: string;
  program: string;
  year: string;
  classIds: number[];
}
```

### Exam
```typescript
interface Exam {
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
```

### Question
```typescript
interface Question {
  id: string;
  type: "essay" | "multi-choice" | "fill-ins";
  points: number;
  questionText: string;
  questionAnswer: string;
  options?: string[];
}
```

### Schedule
```typescript
interface Schedule {
  id: string;
  title: string;
  type: "class" | "examination" | "test" | "meeting";
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isRecurring: boolean;
  recurrence?: {
    frequency: "weekly";
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

## Features

### 1. Exam Taking
- Students can view upcoming and past exams
- Exam details show instructions, duration, and total points
- Timer counts down during exam
- Auto-submission when time expires
- Questions can be essay, multiple choice, or fill-in-the-blank

### 2. Schedule View
- Combined view of classes and exams
- Calendar and table views available
- Color-coded events:
  - Classes: Green
  - Exams: Red
  - Tests: Yellow
  - Meetings: Blue
- Click events to view details
- Weekly recurring class schedules

### 3. Results
- View exam results and grades
- Detailed breakdown per exam
- Overall performance metrics

## API Requirements

### Authentication
```typescript
POST /api/student/login
{
  email: string;
  password: string;
}
```

### Exams
```typescript
// Get student's exams
GET /api/student/exams
Response: Exam[]

// Get specific exam
GET /api/student/exams/:examId
Response: Exam

// Submit exam
POST /api/student/exams/:examId/submit
{
  answers: {
    questionId: string;
    answer: string;
  }[];
}
```

### Schedule
```typescript
// Get student's schedule
GET /api/student/schedule
Response: Schedule[]

// Get class details
GET /api/student/classes/:classId
Response: ClassDetails
```

### Results
```typescript
// Get student's results
GET /api/student/results
Response: {
  examId: number;
  score: number;
  totalPoints: number;
  submittedAt: string;
}[]
```

## State Management

### Student Context
```typescript
interface StudentContext {
  student: StudentData;
  classIds: number[];
  currentExam?: Exam;
  examStatus: "not-started" | "in-progress" | "completed";
}
```

### Local Storage
- Exam progress is saved in localStorage during exam taking
- Format: `exam-{examId}-progress`
- Cleared after submission or expiry

## Error Handling

### Common Error Codes
- 401: Unauthorized/Not logged in
- 403: Not enrolled in class/exam
- 404: Exam/Class not found
- 409: Exam already submitted
- 429: Too many submission attempts 