import { Course } from "./courses";

export interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  createdAt: string;
  updatedAt: string;
  courses: Course[];
}

export const mockPrograms: Program[] = [
  {
    id: "1",
    name: "Bachelor of Science in Information and Communication Technology",
    description: "A comprehensive program covering ICT fundamentals and advanced topics",
    duration: "4 years",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    courses: [],
  },
  {
    id: "2",
    name: "BSc Computer Science",
    description: "Bachelor of Science in Computer Science",
    duration: "4 years",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    courses: [],
  },
];

export const getPrograms = (): Program[] => {
  return mockPrograms;
};

export const getProgramById = (id: string): Program | undefined => {
  return mockPrograms.find((program) => program.id === id);
};

export const createProgram = (program: Omit<Program, "id" | "createdAt" | "updatedAt">): Program => {
  const newProgram: Program = {
    ...program,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockPrograms.push(newProgram);
  return newProgram;
};

export const updateProgram = (id: string, program: Partial<Program>): Program | undefined => {
  const index = mockPrograms.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  const updatedProgram: Program = {
    ...mockPrograms[index],
    ...program,
    updatedAt: new Date().toISOString(),
  };
  mockPrograms[index] = updatedProgram;
  return updatedProgram;
};

export const deleteProgram = (id: string): boolean => {
  const index = mockPrograms.findIndex((program) => program.id === id);
  if (index === -1) return false;
  mockPrograms.splice(index, 1);
  return true;
}; 