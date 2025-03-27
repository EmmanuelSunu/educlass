import { type Exam, type Question, type ExamSubmission, type QuestionSubmission } from "./types";
import examsData from "./exams.json";
import questionsData from "./questions.json";
import submissionsData from "./submissions.json";

// Type assertion for submissions data
const submissions = submissionsData.submissions as ExamSubmission[];

// Helper function to map question data to Question type
const mapQuestionData = (q: any): Question => {
  const baseQuestion: Question = {
    id: q.id,
    type: q.type as Question["type"],
    points: q.points,
    questionText: q.questionText,
    questionAnswer: q.modelAnswer || q.correctAnswer || "",
  };

  if (q.type === "multi-choice" && q.options) {
    baseQuestion.options = q.options.map((opt: any) => opt.text);
  }

  return baseQuestion;
};

// Helper function to get questions for an exam
const getQuestionsForExam = (examId: number): Question[] => {
  return questionsData.questions
    .filter(q => q.examId === examId)
    .map(mapQuestionData);
};

// Helper function to calculate grade based on percentage
const calculateGrade = (percentage: number): string => {
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

// Helper function to grade a question submission
const gradeQuestionSubmission = (question: Question, answer: string): QuestionSubmission => {
  const submission: QuestionSubmission = {
    questionId: question.id,
    answer,
    isCorrect: false,
    score: 0
  };

  if (question.type === "multi-choice" || question.type === "fill-ins") {
    submission.isCorrect = answer.toLowerCase() === question.questionAnswer.toLowerCase();
    submission.score = submission.isCorrect ? question.points : 0;
  } else if (question.type === "essay") {
    // For essay questions, we'll need manual grading
    submission.score = undefined;
    submission.isCorrect = undefined;
  }

  return submission;
};

// Helper function to map exam data to Exam type
const mapExamData = (exam: any): Exam => ({
  ...exam,
  type: exam.type as Exam["type"],
  questions: getQuestionsForExam(exam.id)
});

// Get all exams
export const getExams = (): Exam[] => {
  return examsData.exams.map(mapExamData);
};

// Get exam by ID
export const getExamById = (id: number): Exam | undefined => {
  const exam = examsData.exams.find(exam => exam.id === id);
  if (!exam) return undefined;
  return mapExamData(exam);
};

// Get exams by class ID
export const getExamsByClassId = (classId: number): Exam[] => {
  return examsData.exams
    .filter(exam => exam.classId === classId)
    .map(mapExamData);
};

// Get exam submissions by student ID
export const getExamSubmissionsByStudentId = (studentId: number): ExamSubmission[] => {
  return submissions.filter(submission => submission.studentId === studentId);
};

// Get exam submission by exam ID and student ID
export const getExamSubmission = (examId: number, studentId: number): ExamSubmission | undefined => {
  return submissions.find(sub => sub.examId === examId && sub.studentId === studentId);
};

// Submit exam answers
export const submitExam = (
  examId: number,
  studentId: number,
  answers: Record<string, string>,
  completionTime: string
): ExamSubmission => {
  const exam = getExamById(examId);
  if (!exam) {
    throw new Error(`Exam with ID ${examId} not found`);
  }

  // Grade each question
  const questionSubmissions = exam.questions.map(question => 
    gradeQuestionSubmission(question, answers[question.id] || "")
  );

  // Calculate total score (excluding essay questions)
  const gradedSubmissions = questionSubmissions.filter(sub => sub.score !== undefined);
  const totalScore = gradedSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
  const totalPossiblePoints = gradedSubmissions.reduce((sum, _, index) => 
    sum + exam.questions[index].points, 0
  );

  // Calculate grade
  const percentage = (totalScore / totalPossiblePoints) * 100;
  const grade = calculateGrade(percentage);

  const submission = {
    id: Date.now(), // Use timestamp as ID
    examId,
    studentId,
    submittedAt: new Date().toISOString(),
    completionTime,
    answers: questionSubmissions,
    totalScore,
    grade
  } as ExamSubmission;

  // Add submission to submissions data
  submissions.push(submission);

  return submission;
};

// Get exams by student class IDs
export const getExamsByStudentClassIds = (studentClassIds: number[]): Exam[] => {
  return examsData.exams
    .filter(exam => studentClassIds.includes(exam.classId))
    .map(mapExamData);
}; 