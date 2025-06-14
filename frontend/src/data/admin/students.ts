import { Student } from '../types';

// Mock data - to be replaced with API calls
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@student.university.edu',
    programId: '1',
    enrollmentYear: 2024,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@student.university.edu',
    programId: '1',
    enrollmentYear: 2023,
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Carol White',
    email: 'carol.white@student.university.edu',
    programId: '2',
    enrollmentYear: 2024,
    status: 'active',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

export const getStudents = (): Student[] => {
  return mockStudents;
};

export const getStudentById = (id: string): Student | undefined => {
  return mockStudents.find((student) => student.id === id);
};

export const getStudentsByProgram = (programId: string): Student[] => {
  return mockStudents.filter((student) => student.programId === programId);
};

export const getStudentsByEnrollmentYear = (year: number): Student[] => {
  return mockStudents.filter((student) => student.enrollmentYear === year);
};

export const createStudent = (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Student => {
  const newStudent: Student = {
    ...student,
    id: `S${mockStudents.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockStudents.push(newStudent);
  return newStudent;
};

export const updateStudent = (id: string, student: Partial<Student>): Student | undefined => {
  const index = mockStudents.findIndex((s) => s.id === id);
  if (index === -1) return undefined;

  mockStudents[index] = {
    ...mockStudents[index],
    ...student,
    updatedAt: new Date().toISOString(),
  };
  return mockStudents[index];
};

export const deleteStudent = (id: string): boolean => {
  const index = mockStudents.findIndex((student) => student.id === id);
  if (index === -1) return false;

  mockStudents.splice(index, 1);
  return true;
}; 