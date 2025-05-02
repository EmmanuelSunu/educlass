export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  newStudents: number;
  studentGrowth: number;
  enrollmentRate: number;
  completionRate: number;
  studentsByProgram: {
    name: string;
    count: number;
    percentage: number;
  }[];
  studentActivity: {
    date: string;
    active: number;
    new: number;
  }[];
}

export interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  newCourses: number;
  courseGrowth: number;
  enrollmentRate: number;
  completionRate: number;
  coursesByProgram: {
    name: string;
    count: number;
    percentage: number;
  }[];
  courseActivity: {
    date: string;
    active: number;
    new: number;
  }[];
}

export interface GeneralStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowth: number;
  systemHealth: number;
  recentActivities: {
    id: string;
    type: 'warning' | 'success' | 'info';
    message: string;
    time: string;
  }[];
}

// Mock data - to be replaced with API calls
const mockStudentStats: StudentStats = {
  totalStudents: 850,
  activeStudents: 720,
  newStudents: 45,
  studentGrowth: 15.2,
  enrollmentRate: 82.5,
  completionRate: 76.8,
  studentsByProgram: [
    { name: 'Computer Science', count: 250, percentage: 29.4 },
    { name: 'Business Administration', count: 200, percentage: 23.5 },
    { name: 'Engineering', count: 180, percentage: 21.2 },
    { name: 'Mathematics', count: 120, percentage: 14.1 },
    { name: 'Others', count: 100, percentage: 11.8 },
  ],
  studentActivity: [
    { date: '2024-03-14', active: 680, new: 12 },
    { date: '2024-03-15', active: 695, new: 8 },
    { date: '2024-03-16', active: 705, new: 15 },
    { date: '2024-03-17', active: 710, new: 10 },
    { date: '2024-03-18', active: 715, new: 7 },
    { date: '2024-03-19', active: 718, new: 5 },
    { date: '2024-03-20', active: 720, new: 4 },
  ],
};

const mockCourseStats: CourseStats = {
  totalCourses: 45,
  activeCourses: 40,
  newCourses: 5,
  courseGrowth: 12.5,
  enrollmentRate: 85.2,
  completionRate: 78.3,
  coursesByProgram: [
    { name: 'Computer Science', count: 15, percentage: 33.3 },
    { name: 'Business Administration', count: 12, percentage: 26.7 },
    { name: 'Engineering', count: 10, percentage: 22.2 },
    { name: 'Mathematics', count: 8, percentage: 17.8 },
  ],
  courseActivity: [
    { date: '2024-03-14', active: 38, new: 2 },
    { date: '2024-03-15', active: 39, new: 1 },
    { date: '2024-03-16', active: 39, new: 1 },
    { date: '2024-03-17', active: 40, new: 1 },
    { date: '2024-03-18', active: 40, new: 0 },
    { date: '2024-03-19', active: 40, new: 0 },
    { date: '2024-03-20', active: 40, new: 0 },
  ],
};

const mockGeneralStats: GeneralStats = {
  totalUsers: 1234,
  activeUsers: 980,
  newUsers: 45,
  userGrowth: 12.5,
  systemHealth: 98.5,
  recentActivities: [
    {
      id: '1',
      type: 'warning',
      message: 'System maintenance scheduled for tonight',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'success',
      message: 'New course "Advanced Mathematics" created',
      time: '3 hours ago',
    },
    {
      id: '3',
      type: 'info',
      message: 'Exam "Physics 101" is starting in 30 minutes',
      time: '4 hours ago',
    },
  ],
};

// Data management functions
export const getStudentStats = (): StudentStats => {
  // TODO: Replace with API call
  return mockStudentStats;
};

export const getCourseStats = (): CourseStats => {
  // TODO: Replace with API call
  return mockCourseStats;
};

export const getGeneralStats = (): GeneralStats => {
  // TODO: Replace with API call
  return mockGeneralStats;
}; 