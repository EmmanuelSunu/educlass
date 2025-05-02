import { type Schedule } from './types';
import { courseService } from '../course/service';

// Mock data - replace with actual data source
const schedules: Schedule[] = [];

export const scheduleService = {
  getSchedules: async (): Promise<Schedule[]> => {
    return schedules;
  },

  getSchedulesByCourseId: async (courseId: number): Promise<Schedule[]> => {
    return schedules.filter(schedule => schedule.courseId === courseId);
  },

  getScheduleById: async (id: string): Promise<Schedule | undefined> => {
    return schedules.find(schedule => schedule.id === id);
  },

  createSchedule: async (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Schedule> => {
    // If courseId is provided, verify the course exists
    if (schedule.courseId) {
      try {
        await courseService.getCourseById(schedule.courseId);
      } catch (error) {
        throw new Error(`Course with ID ${schedule.courseId} not found`);
      }
    }

    const newSchedule: Schedule = {
      ...schedule,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    schedules.push(newSchedule);
    return newSchedule;
  },

  updateSchedule: async (id: string, schedule: Partial<Schedule>): Promise<Schedule | undefined> => {
    const index = schedules.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    
    // If courseId is being updated, verify the course exists
    if (schedule.courseId) {
      try {
        await courseService.getCourseById(schedule.courseId);
      } catch (error) {
        throw new Error(`Course with ID ${schedule.courseId} not found`);
      }
    }
    
    schedules[index] = { 
      ...schedules[index], 
      ...schedule,
      updatedAt: new Date().toISOString()
    };
    return schedules[index];
  },

  deleteSchedule: async (id: string): Promise<boolean> => {
    const index = schedules.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    schedules.splice(index, 1);
    return true;
  }
}; 