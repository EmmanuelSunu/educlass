import { type Exam } from "../data/exams/types";

export type ExamStatus = "available" | "scheduled" | "past";

interface StatusInfo {
  label: string;
  color: string;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export const getExamStatus = (exam: Exam, isEnrolled: boolean): ExamStatus => {
  const now = new Date();
  
  // Create exam date objects with proper timezone handling
  const examDate = new Date(exam.dueDate);
  examDate.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const startTime = new Date(exam.dueDate);
  const [startHour, startMinute] = exam.startTime.split(':').map(Number);
  startTime.setHours(startHour, startMinute, 0, 0);
  
  const endTime = new Date(exam.dueDate);
  const [endHour, endMinute] = exam.endTime.split(':').map(Number);
  endTime.setHours(endHour, endMinute, 0, 0);

  // If the exam is past its end time
  if (now > endTime) {
    return "past";
  }

  // If the exam is within its time window and student is enrolled
  if (now >= startTime && now <= endTime && isEnrolled) {
    return "available";
  }

  // If the exam is in the future or student is not enrolled
  return "scheduled";
};

export const getStatusInfo = (status: ExamStatus): StatusInfo => {
  switch (status) {
    case "available":
      return {
        label: "Active",
        color: "bg-green-100 text-green-700",
      };
    case "scheduled":
      return {
        label: "Upcoming",
        color: "bg-purple-100 text-purple-700",
      };
    case "past":
      return {
        label: "Completed",
        color: "bg-slate-100 text-slate-700",
      };
  }
}; 