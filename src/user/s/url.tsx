const URLS = {
  // Base paths
  BASE: "/user/s",

  // Dashboard routes
  DASHBOARD: "/user/s/dashboard",
  SCHEDULE: "/user/s/schedules",
  EXAMS: "/user/s/exams",
  SETTINGS: "/user/s/settings",
  RESULTS: "/user/s/results",
  CLASSES: "/user/s/classes",

  // Exam specific routes
  EXAM_DETAILS: (id: string) => `/user/s/exams/details/${id}`,
  
  // Class specific routes
  CLASS_DETAILS: (id: string) => `/user/s/classes/${id}`,

  // Profile routes
  PROFILE: "/user/s/profile",
} as const;

export default URLS;
