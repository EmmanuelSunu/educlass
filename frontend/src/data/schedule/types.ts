export interface Schedule {
  id: string;
  title: string;
  type: "class" | "examination" | "studyGroup" | "consultation";
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description?: string;
  isRecurring: boolean;
  courseId?: number; // Link to course
  recurrence?: {
    frequency: "daily" | "weekly" | "monthly";
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleService {
  getSchedules(): Promise<Schedule[]>;
  getSchedulesByCourseId(courseId: number): Promise<Schedule[]>;
  getScheduleById(id: string): Promise<Schedule | undefined>;
  createSchedule(schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Schedule>;
  updateSchedule(id: string, schedule: Partial<Schedule>): Promise<Schedule | undefined>;
  deleteSchedule(id: string): Promise<boolean>;
} 