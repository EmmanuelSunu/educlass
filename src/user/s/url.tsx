const URLS = {
  // Base paths
  BASE: "/user/s",

  // Dashboard routes
  DASHBOARD: "/user/s/dashboard",
  SCHEDULE: "/user/s/schedules",
  EXAMS: "/user/s/exams",
  SETTINGS: "/user/s/settings",
  RESULTS: "user/s/results",

  // Exam specific routes
  EXAM_DETAILS: (id: string) => `/user/s/exams/details/${id}`,

  // Profile routes
  PROFILE: "/user/s/profile",
} as const;

export default URLS;
