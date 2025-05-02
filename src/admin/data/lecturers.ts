export interface Lecturer {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data for lecturers
export const mockLecturers: Lecturer[] = [
  {
    id: "1",
    staffId: "LEC001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    department: "Computer Science",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    staffId: "LEC002",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    department: "Information Technology",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

export const getLecturers = (): Lecturer[] => {
  return mockLecturers;
};

export const getLecturerById = (id: string): Lecturer | undefined => {
  return mockLecturers.find((lecturer) => lecturer.id === id);
};

export const createLecturer = (lecturer: Omit<Lecturer, "id" | "createdAt" | "updatedAt">): Lecturer => {
  const newLecturer: Lecturer = {
    ...lecturer,
    id: String(mockLecturers.length + 1),
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
  const index = mockLecturers.findIndex((l) => l.id === id);
  if (index === -1) return false;

  mockLecturers.splice(index, 1);
  return true;
}; 