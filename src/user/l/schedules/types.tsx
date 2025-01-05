// types/schedule.ts
export type ScheduleType = 'class' | 'examination' | 'test' | 'meeting';

export interface Schedule {
  id: string;
  title: string;
  type: ScheduleType;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  location?: string;
  isRecurring: boolean;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
}