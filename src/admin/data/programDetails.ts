import { Program, getProgramById } from "./programs";
import { Course, getCoursesByProgram, updateCourse } from "./courses";

export interface ProgramDetails extends Program {
  courses: Course[];
}

export const getProgramDetails = (id: string): ProgramDetails | undefined => {
  const program = getProgramById(id);
  if (!program) return undefined;

  const courses = getCoursesByProgram(id);
  return {
    ...program,
    courses,
  };
};

export const addCourseToProgram = (programId: string, courseId: string): Course | undefined => {
  const updatedCourse = updateCourse(courseId, { programId });
  return updatedCourse || undefined;
};

export const updateCourseInProgram = (programId: string, courseId: string, course: Partial<Course>): Course | undefined => {
  const updatedCourse = updateCourse(courseId, { ...course, programId });
  return updatedCourse || undefined;
};

export const deleteCourseFromProgram = (courseId: string): boolean => {
  const updatedCourse = updateCourse(courseId, { programId: "" });
  return !!updatedCourse;
}; 