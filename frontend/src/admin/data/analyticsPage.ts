export interface ActivityItem {
  id: string;
  type: 'warning' | 'success' | 'info';
  user: string;
  course: string;
  timestamp: string;
}

export interface AnalyticsPageData {
  totalEnrollments: number;
  activeEnrollments: number;
  completionRate: number;
  averageGrade: number;
  recentActivities: ActivityItem[];
}

// Mock data - to be replaced with API calls
const mockAnalyticsPageData: AnalyticsPageData = {
  totalEnrollments: 2850,
  activeEnrollments: 2450,
  completionRate: 78.5,
  averageGrade: 82.3,
  recentActivities: [
    {
      id: '1',
      type: 'success',
      user: 'John Doe',
      course: 'Introduction to Programming',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'info',
      user: 'Jane Smith',
      course: 'Data Structures',
      timestamp: '3 hours ago',
    },
    {
      id: '3',
      type: 'warning',
      user: 'Mike Johnson',
      course: 'Calculus I',
      timestamp: '4 hours ago',
    },
  ],
};

// Data management functions
export const getAnalyticsPageData = (): AnalyticsPageData => {
  // TODO: Replace with API call
  return mockAnalyticsPageData;
}; 