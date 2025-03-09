
import React, { useState } from "react";
import DashboardLayout from "../layout";
import ScheduleCalendar from "../../../components/ScheduleCalendar";
import ScheduleTable from "../../../components/ScheduleTable";
import ButtonProps from "../../../components/ButtonProps";
import { RiCalendarLine, RiListCheck2 } from "react-icons/ri";
import { Schedule } from "../../l/schedules/types";

// Use some of the schedules from lecturer app for demonstration
const schedules: Schedule[] = [
  {
    id: "1",
    title: "Operating Systems Class",
    type: "class",
    date: "2024-12-24",
    startTime: "09:00",
    endTime: "10:30",
    location: "Room 101",
    isRecurring: true,
    recurrence: {
      frequency: "weekly",
      endDate: "2025-03-24",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Database Final Exam",
    type: "examination",
    date: "2024-12-26",
    startTime: "14:00",
    endTime: "16:00",
    location: "Main Hall",
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Data Structures Tutorial",
    type: "class",
    date: "2024-12-22",
    startTime: "11:00",
    endTime: "12:30",
    location: "Room 205",
    isRecurring: true,
    recurrence: {
      frequency: "weekly",
      endDate: "2025-04-15",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Programming Group Study",
    type: "studyGroup",
    date: "2024-12-21",
    startTime: "16:00",
    endTime: "18:00",
    location: "Library Study Room 3",
    isRecurring: true,
    recurrence: {
      frequency: "weekly",
      endDate: "2025-01-30",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const StudentSchedulePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");

  return (
    <DashboardLayout
      title="My Schedule"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <div className="flex space-x-2">
          <ButtonProps
            variant={viewMode === "calendar" ? "primary" : "secondary"}
            onClick={() => setViewMode("calendar")}
            className="gap-2"
          >
            <RiCalendarLine />
            Calendar
          </ButtonProps>
          <ButtonProps
            variant={viewMode === "table" ? "primary" : "secondary"}
            onClick={() => setViewMode("table")}
            className="gap-2"
          >
            <RiListCheck2 />
            Table
          </ButtonProps>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <ScheduleCalendar
          schedules={schedules}
          onEventClick={() => {}}
          onDateSelect={() => {}}
        />
      ) : (
        <ScheduleTable
          schedules={schedules}
          onEdit={() => {}}
          onDelete={() => {}}
          viewOnly={true}
        />
      )}
    </DashboardLayout>
  );
};

export default StudentSchedulePage;
