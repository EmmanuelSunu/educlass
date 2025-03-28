export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  programId: string;
  lecturerId: string;
  credits: number;
  duration: string;
  status: 'active' | 'inactive';
  level: '100' | '200' | '300' | '400';
  createdAt: string;
  updatedAt: string;
}

// Mock data - to be replaced with API calls
const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Introduction to Programming',
    code: 'CS101',
    description: 'Basic programming concepts and problem-solving techniques',
    programId: '1',
    lecturerId: '1',
    credits: 3,
    duration: '14 weeks',
    status: 'active',
    level: '100',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Data Structures',
    code: 'CS201',
    description: 'Study of fundamental data structures and algorithms',
    programId: '1',
    lecturerId: '2',
    credits: 4,
    duration: '14 weeks',
    status: 'active',
    level: '200',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Business Analytics',
    code: 'BA101',
    description: 'Introduction to business analytics and data-driven decision making',
    programId: '2',
    lecturerId: '3',
    credits: 3,
    duration: '14 weeks',
    status: 'active',
    level: '100',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

// Data management functions
export const getCourses = (): Course[] => {
  // TODO: Replace with API call
  return mockCourses;
};

export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find((course) => course.id === id);
};

export const getCoursesByProgram = (programId: string): Course[] => {
  return mockCourses.filter((course) => course.programId === programId);
};

export const createCourse = (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Course | null => {
  const newCourse: Course = {
    ...course,
    id: `CS${mockCourses.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockCourses.push(newCourse);
  return newCourse;
};

export const updateCourse = (id: string, course: Partial<Course>): Course | null => {
  const index = mockCourses.findIndex((c) => c.id === id);
  if (index === -1) return null;

  mockCourses[index] = {
    ...mockCourses[index],
    ...course,
    updatedAt: new Date().toISOString(),
  };
  return mockCourses[index];
};

export const deleteCourse = (id: string): boolean => {
  const index = mockCourses.findIndex((c) => c.id === id);
  if (index === -1) return false;

  mockCourses.splice(index, 1);
  return true;
}; 