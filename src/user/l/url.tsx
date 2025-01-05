// urls.tsx
const URLS = {
    // Base paths
    BASE: '/user/l',
    
    // Dashboard routes
    DASHBOARD: '/user/l/dashboard',
    SCHEDULE: '/user/l/schedules',
    EXAMS: '/user/l/exams',
    CLASS: '/user/l/class',
    GRADING: '/user/l/grading',
  
    // Exam specific routes
    EXAM_DETAILS: (id: string) => `/user/l/exams/${id}`,
    EXAM_EDIT: (id: string) => `/user/l/exams/${id}/edit`,
    EXAM_CREATE: '/user/l/exams/create',
  
    // Student specific routes
    STUDENT_DETAILS: (id: string) => `/user/l/class/${id}`,
    STUDENT_EDIT: (id: string) => `/user/l/class/${id}/edit`,
    
    // Schedule specific routes
    SCHEDULE_DETAILS: (id: string) => `/user/l/schedule/${id}`,
    SCHEDULE_CREATE: '/user/l/schedule/create',
  
    // Profile routes
    PROFILE: '/user/l/profile',
    SETTINGS: '/user/l/settings'
  } as const;
  
  export default URLS;