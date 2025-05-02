import { Course, CourseEvent, CourseService } from './types';
import coursesJson from './courses.json';

// Cast the imported JSON to the correct type
const courses: Course[] = (coursesJson as any).courses;

// Helper functions
const generateId = (items: { id: number }[]): number => {
  return Math.max(...items.map(item => item.id), 0) + 1;
};

const validateCourse = (course: Partial<Course>): void => {
  const requiredFields = ['code', 'name', 'level', 'status', 'program', 'semester', 'lecturerId', 'description'] as const;
  for (const field of requiredFields) {
    if (!course[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  if (course.status && !['Active', 'Inactive'].includes(course.status)) {
    throw new Error('Invalid status value');
  }
};

const validateCourseEvent = (event: Partial<CourseEvent>): void => {
  const requiredFields = ['title', 'type', 'startTime', 'endTime', 'location', 'description', 'recurrence'] as const;
  for (const field of requiredFields) {
    if (!event[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (event.type && !['lecture', 'tutorial', 'lab', 'other'].includes(event.type)) {
    throw new Error('Invalid event type');
  }

  if (event.recurrence && !['weekly', 'biweekly', 'none'].includes(event.recurrence)) {
    throw new Error('Invalid recurrence value');
  }

  if (event.recurrence !== 'none' && !event.endDate) {
    throw new Error('End date is required for recurring events');
  }

  if (event.dayOfWeek !== undefined && (event.dayOfWeek < 0 || event.dayOfWeek > 6)) {
    throw new Error('Day of week must be between 0 and 6');
  }
};

const castToCourse = (data: any): Course => {
  validateCourse(data);
  if (data.events) {
    data.events.forEach(validateCourseEvent);
  }
  return {
    id: data.id,
    code: data.code,
    name: data.name,
    level: data.level,
    status: data.status,
    program: data.program,
    semester: data.semester,
    lecturerId: data.lecturerId,
    description: data.description,
    students: data.students || [],
    events: data.events || []
  };
};

// Course service implementation
export const courseService: CourseService = {
  async getCourses(): Promise<Course[]> {
    return courses.map(castToCourse);
  },

  async getCourseById(id: number): Promise<Course> {
    const course = courses.find((c: Course) => c.id === id);
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return castToCourse(course);
  },

  async getCoursesByStudentId(studentId: number): Promise<Course[]> {
    return courses
      .filter((course: Course) => course.students?.includes(studentId))
      .map(castToCourse);
  },

  async getCoursesByLecturerId(lecturerId: number): Promise<Course[]> {
    return courses
      .filter((course: Course) => course.lecturerId === lecturerId)
      .map(castToCourse);
  },

  async createCourse(courseData: Omit<Course, 'id' | 'events'>): Promise<Course> {
    validateCourse(courseData);
    const newCourse: Course = {
      ...courseData,
      id: generateId(courses),
      events: [],
      students: []
    };
    courses.push(newCourse);
    return newCourse;
  },

  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course> {
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Course with ID ${id} not found`);
    }

    // Preserve the original ID and merge updates
    const updatedCourse = {
      ...courses[index],
      ...courseData,
      id // Ensure ID remains unchanged
    };

    validateCourse(updatedCourse);
    courses[index] = updatedCourse;
    return updatedCourse;
  },

  async deleteCourse(id: number): Promise<void> {
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Course with ID ${id} not found`);
    }
    courses.splice(index, 1);
  },

  async enrollStudent(courseId: number, studentId: number): Promise<void> {
    const course = await this.getCourseById(courseId);
    if (!course.students) {
      course.students = [];
    }
    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
      await this.updateCourse(courseId, { students: course.students });
    }
  },

  async removeStudent(courseId: number, studentId: number): Promise<void> {
    const course = await this.getCourseById(courseId);
    if (course.students) {
      course.students = course.students.filter(id => id !== studentId);
      await this.updateCourse(courseId, { students: course.students });
    }
  },

  async getEnrolledStudents(courseId: number): Promise<number[]> {
    const course = await this.getCourseById(courseId);
    return course.students || [];
  },

  async getCourseEvents(courseId: number): Promise<CourseEvent[]> {
    const course = await this.getCourseById(courseId);
    return course.events || [];
  },

  async createCourseEvent(courseId: number, eventData: Omit<CourseEvent, 'id'>): Promise<CourseEvent> {
    const course = await this.getCourseById(courseId);
    validateCourseEvent(eventData);
    
    const newEvent: CourseEvent = {
      ...eventData,
      id: generateId(course.events)
    };
    
    course.events.push(newEvent);
    await this.updateCourse(courseId, { events: course.events });
    return newEvent;
  },

  async updateCourseEvent(courseId: number, eventId: number, eventData: Partial<CourseEvent>): Promise<CourseEvent> {
    const course = await this.getCourseById(courseId);
    const eventIndex = course.events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      throw new Error(`Event with ID ${eventId} not found in course ${courseId}`);
    }

    const updatedEvent = {
      ...course.events[eventIndex],
      ...eventData,
      id: eventId // Ensure ID remains unchanged
    };

    validateCourseEvent(updatedEvent);
    course.events[eventIndex] = updatedEvent;
    await this.updateCourse(courseId, { events: course.events });
    return updatedEvent;
  },

  async deleteCourseEvent(courseId: number, eventId: number): Promise<void> {
    const course = await this.getCourseById(courseId);
    const eventIndex = course.events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      throw new Error(`Event with ID ${eventId} not found in course ${courseId}`);
    }

    course.events.splice(eventIndex, 1);
    await this.updateCourse(courseId, { events: course.events });
  }
}; 