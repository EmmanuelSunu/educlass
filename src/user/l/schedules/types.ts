export interface Recurrence {
  frequency: "daily" | "weekly" | "monthly";
  endDate: string;
}

export interface Schedule {
  id: string;
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description?: string; // Add this line
  isRecurring: boolean;
  recurrence?: Recurrence;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleFormData {
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
}
