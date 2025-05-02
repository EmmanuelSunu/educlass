const URLS = {
  // Base paths
  BASE: "/admin",
  
  // Dashboard routes
  DASHBOARD: "/admin/dashboard",
  
  // User management routes
  USERS: "/admin/users",
  USERS_CREATE: "/admin/users/create",
  USERS_EDIT: (id: string) => `/admin/users/${id}/edit`,
  USERS_DETAILS: (id: string) => `/admin/users/${id}`,

  
  
  // Course management routes
  COURSES: "/admin/courses",
  COURSES_CREATE: "/admin/courses/create",
  COURSES_EDIT: (id: string) => `/admin/courses/${id}/edit`,
  COURSES_DETAILS: (id: string) => `/admin/courses/${id}`,
  
  // Analytics routes
  ANALYTICS: "/admin/analytics",
  ANALYTICS_STUDENTS: "/admin/analytics/students",
  ANALYTICS_COURSES: "/admin/analytics/courses",
  
  // Settings routes
  SETTINGS: "/admin/settings",
} as const;

export default URLS; 