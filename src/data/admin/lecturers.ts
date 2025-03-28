import { Lecturer } from '../types';

// Mock data - to be replaced with API calls
const mockLecturers: Lecturer[] = [
  {
    id: '1',
    name: 'Dr. John Smith',
    email: 'john.smith@university.edu',
    department: 'Computer Science',
    status: 'active',
    courses: ['1'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Prof. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    department: 'Computer Science',
    status: 'active',
    courses: ['2'],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Dr. Michael Brown',
    email: 'michael.brown@university.edu',
    department: 'Business Analytics',
    status: 'active',
    courses: ['3'],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

export const getLecturers = (): Lecturer[] => {
  return mockLecturers;
};

export const getLecturerById = (id: string): Lecturer | undefined => {
  return mockLecturers.find((lecturer) => lecturer.id === id);
};

export const getLecturersByDepartment = (department: string): Lecturer[] => {
  return mockLecturers.filter((lecturer) => lecturer.department === department);
};

export const createLecturer = (lecturer: Omit<Lecturer, 'id' | 'createdAt' | 'updatedAt'>): Lecturer => {
  const newLecturer: Lecturer = {
    ...lecturer,
    id: `L${mockLecturers.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockLecturers.push(newLecturer);
  return newLecturer;
};

export const updateLecturer = (id: string, lecturer: Partial<Lecturer>): Lecturer | undefined => {
  const index = mockLecturers.findIndex((l) => l.id === id);
  if (index === -1) return undefined;

  mockLecturers[index] = {
    ...mockLecturers[index],
    ...lecturer,
    updatedAt: new Date().toISOString(),
  };
  return mockLecturers[index];
};

export const deleteLecturer = (id: string): boolean => {
  const index = mockLecturers.findIndex((lecturer) => lecturer.id === id);
  if (index === -1) return false;

  mockLecturers.splice(index, 1);
  return true;
}; 