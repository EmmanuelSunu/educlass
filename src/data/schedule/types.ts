export interface Schedule {
  id: string;
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isRecurring: boolean;
  recurrence?: {
    frequency: string;
    endDate: string;
  };
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleService {
  getSchedules: () => Promise<Schedule[]>;
  getSchedulesByCourseId: (courseId: number) => Promise<Schedule[]>;
  createSchedule: (schedule: Schedule) => Promise<Schedule>;
  updateSchedule: (schedule: Schedule) => Promise<Schedule>;
  deleteSchedule: (scheduleId: string) => Promise<void>;
} 