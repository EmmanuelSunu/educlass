# Student Flows and UI Components

## Exam Flow

### 1. Exam List View
- Component: `src/user/s/exams/index.tsx`
- Shows all available exams with status
- Uses `ExamCard` component to display each exam
- Filters:
  - Upcoming
  - Completed
  - All

### 2. Exam Details View
- Component: `src/user/s/exams/details/index.tsx`
- Shows comprehensive exam information
- Displays:
  - Instructions
  - Duration
  - Total points
  - Start button (if available)
  - Due date and time

### 3. Exam Taking View
- Component: `src/user/s/exams/take/index.tsx`
- Features:
  - Floating timer in top-right
  - Question navigation
  - Auto-save answers
  - Submit confirmation
  - Auto-submit on time expiry

## Schedule Flow

### 1. Calendar View
- Component: `src/user/s/schedules/index.tsx`
- Features:
  - Month/Week/Day views
  - Color-coded events
  - Event details on click
  - Recurring class schedules
  - Combined exam and class events

### 2. Table View
- Component: `src/components/ScheduleTable.tsx`
- Shows events in list format
- Sortable by date/time
- Filterable by event type
- Responsive design for mobile

## Results Flow

### 1. Results List
- Component: `src/user/s/results/index.tsx`
- Shows all exam results
- Uses `ResultCard` component
- Features:
  - Score display
  - Pass/Fail status
  - Date taken
  - Click for details

### 2. Result Details
- Shows detailed breakdown
- Question-by-question review
- Correct answers display
- Score calculation

## Shared Components

### ExamCard
```typescript
interface ExamCardProps {
  exam: Exam;
  onClick?: () => void;
}
```
- Location: `src/components/examCard.tsx`
- Used in exam list and dashboard
- Shows:
  - Title
  - Due date
  - Duration
  - Status indicator

### ScheduleEventModal
```typescript
interface ScheduleEventModalProps {
  schedule: Schedule;
  isOpen: boolean;
  onClose: () => void;
}
```
- Location: `src/components/ScheduleEventModal.tsx`
- Shows event details
- Color-coded header by event type
- Displays:
  - Title
  - Date and time
  - Location
  - Recurrence info (if applicable)

### ResultCard
```typescript
interface ResultCardProps {
  result: {
    examId: number;
    score: number;
    totalPoints: number;
    submittedAt: string;
  };
  onClick?: () => void;
}
```
- Location: `src/components/ResultCard.tsx`
- Shows:
  - Score
  - Percentage
  - Submission date
  - Visual score indicator

## Navigation

### Student Dashboard Layout
- Component: `src/user/s/layout/index.tsx`
- Sidebar navigation
- Header with user info
- Main content area
- Responsive design

### Sidebar Items
```typescript
const studentNavItems = [
  { path: "/s/dashboard", label: "Dashboard", icon: RiDashboardLine },
  { path: "/s/exams", label: "Exams", icon: RiFileTextLine },
  { path: "/s/schedule", label: "Schedule", icon: RiCalendarLine },
  { path: "/s/results", label: "Results", icon: RiBarChartLine },
];
```

## State Management

### Exam Progress
```typescript
interface ExamProgress {
  answers: Record<string, string>;
  timeRemaining: number;
  lastSaved: string;
}
```
- Stored in localStorage
- Auto-saved every minute
- Cleared on submission

### Schedule State
```typescript
interface ScheduleState {
  viewMode: "calendar" | "table";
  selectedEvent: Schedule | null;
}
```
- Managed with React useState
- Persists view preference 