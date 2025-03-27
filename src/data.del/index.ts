import type { Question, Exam, Student, Class, ClassDetails, StudentData, Schedule } from './types';

import examsJson from './exams.json';
import classesJson from './classes.json';
import classDetailsJson from './classDetails.json';
import studentJson from './student.json';
import studentClassIdsJson from './studentClassIds.json';
import schedulesJson from './schedules.json';

export const exams = examsJson.exams as unknown as Exam[];
export const classes = classesJson.classes as unknown as Class[];
export const classDetails = classDetailsJson as unknown as Record<number, Omit<ClassDetails, 'name'> & { name?: string }>;
export const studentData = studentJson as StudentData;
export const studentClassIds = studentClassIdsJson as number[];
export const schedules = schedulesJson.schedules as unknown as Schedule[];

export type {
  Question,
  Exam,
  Student,
  Class,
  ClassDetails,
  StudentData,
  Schedule,
}; 