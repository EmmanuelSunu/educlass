import { AnalyticsData } from '../types';
import { getStudents } from './students';
import { getLecturers } from './lecturers';
import { getCourses } from './courses';
import { getPrograms } from './programs';

// Mock data - to be replaced with API calls
const mockAnalyticsData: AnalyticsData = {
  totalStudents: 150,
  totalLecturers: 25,
  totalCourses: 45,
  totalPrograms: 8,
  studentEnrollmentTrend: [
    { year: 2020, count: 120 },
    { year: 2021, count: 135 },
    { year: 2022, count: 145 },
    { year: 2023, count: 150 },
  ],
  courseEnrollmentStats: [
    { courseId: '1', courseName: 'Introduction to Programming', enrolledStudents: 45 },
    { courseId: '2', courseName: 'Data Structures', enrolledStudents: 35 },
    { courseId: '3', courseName: 'Business Analytics', enrolledStudents: 30 },
  ],
};

export const getAnalyticsData = (): AnalyticsData => {
  // In a real application, this would aggregate data from various sources
  return mockAnalyticsData;
};

export const getCurrentStats = () => {
  const students = getStudents();
  const lecturers = getLecturers();
  const courses = getCourses();
  const programs = getPrograms();

  return {
    totalStudents: students.length,
    totalLecturers: lecturers.length,
    totalCourses: courses.length,
    totalPrograms: programs.length,
  };
};

export const getEnrollmentTrend = (years: number = 4) => {
  const currentYear = new Date().getFullYear();
  const students = getStudents();
  
  return Array.from({ length: years }, (_, i) => {
    const year = currentYear - i;
    return {
      year,
      count: students.filter(s => s.enrollmentYear === year).length,
    };
  }).reverse();
};

export const getCourseEnrollmentStats = () => {
  const courses = getCourses();
  // const students = getStudents();
  
  return courses.map(course => ({
    courseId: course.id,
    courseName: course.name,
    enrolledStudents: Math.floor(Math.random() * 50) + 20, // Mock data - replace with actual enrollment data
  }));
}; 