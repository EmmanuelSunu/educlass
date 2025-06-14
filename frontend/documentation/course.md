# Course Management

## Overview
The course management system allows both students and lecturers to interact with courses. Lecturers can create and manage courses, while students can view their enrolled courses and related information.

## Data Structure

### Course
```typescript
interface Course {
  id: number;              // Unique identifier
  code: string;           // Course code (e.g., "CS101")
  name: string;           // Course name
  level: string;          // Course level
  program: string;        // Program name
  semester: string;       // Current semester
  lecturerId: number;     // Reference to lecturer user
  description: string;    // Course description
  students: number[];     // Array of student user IDs
  events: CourseEvent[];  // Course schedule/timetable
}

interface CourseEvent {
  id: number;
  title: string;
  type: "lecture" | "tutorial" | "lab" | "other";
  startTime: string;      // ISO date string
  endTime: string;        // ISO date string
  location?: string;
  description?: string;
  recurrence?: "weekly" | "biweekly" | "none";
  dayOfWeek?: number;     // 0-6 (Sunday-Saturday)
}
```

## Student Flows

### 1. View Enrolled Courses
- Component: `src/user/s/classes/index.tsx`
- Features:
  - List of enrolled courses
  - Course details (code, name, level, program)
  - Lecturer information
  - Course schedule
  - Quick access to course materials

### 2. Course Details View
- Shows comprehensive course information
- Displays:
  - Course description
  - Lecturer details
  - Course schedule
  - Upcoming events
  - Related exams and assignments

### 3. Course Schedule View
- Integrated with the main schedule view
- Shows:
  - Regular class sessions
  - Tutorials
  - Labs
  - Other course events
- Color-coded by event type
- Recurring events support

## Lecturer Flows

### 1. Course Management
- Component: `src/user/l/class/index.tsx`
- Features:
  - Create new courses
  - Edit existing courses
  - Delete courses
  - Manage student enrollment

### 2. Course Creation
- Required fields:
  - Course code
  - Course name
  - Level
  - Program
  - Semester
  - Description
- Optional fields:
  - Initial student list
  - Course schedule

### 3. Course Schedule Management
- Add/edit/delete course events
- Support for:
  - Regular lectures
  - Tutorials
  - Labs
  - One-time events
- Recurring events configuration
- Location management

### 4. Student Management
- View enrolled students
- Add/remove students
- Bulk student import
- Student attendance tracking

## Shared Components

### CourseCard
```typescript
interface CourseCardProps {
  course: Course;
  onClick?: () => void;
  showActions?: boolean;
}
```
- Location: `src/components/courseCard.tsx`
- Used in both student and lecturer views
- Shows:
  - Course code and name
  - Level and program
  - Lecturer information
  - Quick actions (if applicable)

### CourseEventModal
```typescript
interface CourseEventModalProps {
  event: CourseEvent;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (event: CourseEvent) => void;
}
```
- Location: `src/components/CourseEventModal.tsx`
- Shows event details
- Used for creating/editing course events
- Color-coded by event type

## API Service

### Course Service
```typescript
interface CourseService {
  // Course operations
  getCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course>;
  getCoursesByStudentId(studentId: number): Promise<Course[]>;
  getCoursesByLecturerId(lecturerId: number): Promise<Course[]>;
  createCourse(course: Omit<Course, 'id'>): Promise<Course>;
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
```

## Data Relationships
- Courses reference users (lecturer and students) by ID
- Course events are stored within the course object
- Exams and assignments are linked to courses through the course ID
- Schedule events are combined from course events and exam/assignment dates 