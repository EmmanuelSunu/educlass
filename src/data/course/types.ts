export interface Course {
  id: number;              // Unique identifier
  code: string;           // Course code (e.g., "CS101")
  name: string;           // Course name
  level: string;          // Course level (e.g., "Level 300")
  status: "Active" | "Inactive"; // Course status
  program: string;        // Program name
  semester: string;       // Current semester
  lecturerId: number;     // Reference to lecturer user
  description: string;    // Course description
  students: number[];     // Array of student user IDs
  events: CourseEvent[];  // Course schedule/timetable
}

export interface CourseEvent {
  id: number;
  title: string;
  type: "lecture" | "tutorial" | "lab" | "other";
  startTime: string;      // ISO date string
  endTime: string;        // ISO date string
  location: string;       // Required location
  description: string;    // Required description
  recurrence: "weekly" | "biweekly" | "none";
  dayOfWeek?: number;     // 0-6 (Sunday-Saturday), optional for non-recurring events
  endDate?: string;       // ISO date string, required for recurring events
}

export interface CourseService {
  // Course operations
  getCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course>;
  getCoursesByStudentId(studentId: number): Promise<Course[]>;
  getCoursesByLecturerId(lecturerId: number): Promise<Course[]>;
  createCourse(course: Omit<Course, 'id' | 'events'>): Promise<Course>;
  updateCourse(id: number, course: Partial<Course>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;

  // Student enrollment
  enrollStudent(courseId: number, studentId: number): Promise<void>;
  removeStudent(courseId: number, studentId: number): Promise<void>;
  getEnrolledStudents(courseId: number): Promise<number[]>;

  // Course events
  getCourseEvents(courseId: number): Promise<CourseEvent[]>;
  createCourseEvent(courseId: number, event: Omit<CourseEvent, 'id'>): Promise<CourseEvent>;
  updateCourseEvent(courseId: number, eventId: number, event: Partial<CourseEvent>): Promise<CourseEvent>;
  deleteCourseEvent(courseId: number, eventId: number): Promise<void>;
} 