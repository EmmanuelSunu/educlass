export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  programId: string;
  level: string;
  semester: string;
  enrolledCourses: {
    courseId: string;
    lecturerId: string;
    grade?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockStudents: Student[] = [
  {
    id: "1",
    studentId: "STU001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    programId: "1",
    level: "100",
    semester: "First Semester",
    enrolledCourses: [
      {
        courseId: "1",
        lecturerId: "1",
        grade: "A",
      },
      {
        courseId: "2",
        lecturerId: "2",
        grade: "B+",
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    studentId: "STU002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    programId: "2",
    level: "200",
    semester: "Second Semester",
    enrolledCourses: [
      {
        courseId: "3",
        lecturerId: "1",
        grade: "A-",
      },
    ],
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
];

// CRUD Operations
export const getStudents = (): Student[] => {
  return mockStudents;
};

export const getStudentById = (id: string): Student | undefined => {
  return mockStudents.find((student) => student.id === id);
};

export const getStudentsByProgram = (programId: string): Student[] => {
  return mockStudents.filter((student) => student.programId === programId);
};

export const createStudent = (student: Omit<Student, "id" | "createdAt" | "updatedAt">): Student | null => {
  const newStudent: Student = {
    ...student,
    id: `STU${mockStudents.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockStudents.push(newStudent);
  return newStudent;
};

export const updateStudent = (id: string, student: Partial<Student>): Student | null => {
  const index = mockStudents.findIndex((s) => s.id === id);
  if (index === -1) return null;

  mockStudents[index] = {
    ...mockStudents[index],
    ...student,
    updatedAt: new Date().toISOString(),
  };
  return mockStudents[index];
};

export const deleteStudent = (id: string): boolean => {
  const index = mockStudents.findIndex((s) => s.id === id);
  if (index === -1) return false;

  mockStudents.splice(index, 1);
  return true;
};

export const enrollStudentInCourse = (
  studentId: string,
  courseId: string,
  lecturerId: string
): boolean => {
  const student = getStudentById(studentId);
  if (!student) return false;

  // Check if student is already enrolled in the course
  if (student.enrolledCourses.some((course) => course.courseId === courseId)) {
    return false;
  }

  student.enrolledCourses.push({
    courseId,
    lecturerId,
  });
  student.updatedAt = new Date().toISOString();
  return true;
};

export const updateStudentGrade = (
  studentId: string,
  courseId: string,
  grade: string
): boolean => {
  const student = getStudentById(studentId);
  if (!student) return false;

  const courseIndex = student.enrolledCourses.findIndex(
    (course) => course.courseId === courseId
  );
  if (courseIndex === -1) return false;

  student.enrolledCourses[courseIndex].grade = grade;
  student.updatedAt = new Date().toISOString();
  return true;
}; 