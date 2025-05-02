/**
 * Utility functions for exam time and status calculations
 */

/**
 * Calculate exam status based on due date and time window
 */
export const calculateExamStatus = (
  dueDate: Date,
  startTime: string,
  endTime: string
): "upcoming" | "available" | "past" => {
  const now = new Date();
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  // Set the time window on the due date
  const examStartDateTime = new Date(dueDate);
  examStartDateTime.setHours(startHour, startMinute, 0);

  const examEndDateTime = new Date(dueDate);
  examEndDateTime.setHours(endHour, endMinute, 0);

  if (now < examStartDateTime) {
    return "upcoming";
  } else if (now > examEndDateTime) {
    return "past";
  } else {
    return "available";
  }
};

/**
 * Calculate duration string from hours and minutes
 */
export const calculateDuration = (hours: number, minutes: number): string => {
  if (hours === 0 && minutes === 0) return "";
  
  const parts = [];
  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }
  
  return parts.join(' and ');
};

/**
 * Format time string to HH:mm format
 */
export const formatTimeString = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Validate time string format (HH:mm)
 */
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Compare fill-in-the-blank answers (case-insensitive)
 */
export const compareAnswers = (userAnswer: string, correctAnswer: string): boolean => {
  return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
};

/**
 * Calculate total points for an exam
 */
export const calculateTotalPoints = (questions: Array<{ points: number }>): number => {
  return questions.reduce((sum, question) => sum + question.points, 0);
};

/**
 * Check if exam is available for taking
 */
export const isExamAvailable = (
  dueDate: Date,
  startTime: string,
  endTime: string
): boolean => {
  return calculateExamStatus(dueDate, startTime, endTime) === "available";
};

/**
 * Format exam time display
 */
export const formatExamTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Calculate remaining time in seconds
 */
export const calculateRemainingTime = (
  dueDate: Date,
  endTime: string
): number => {
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const endDateTime = new Date(dueDate);
  endDateTime.setHours(endHour, endMinute, 0);
  
  const now = new Date();
  return Math.max(0, Math.floor((endDateTime.getTime() - now.getTime()) / 1000));
}; 