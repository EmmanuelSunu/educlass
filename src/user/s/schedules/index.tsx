import DashboardLayout from "../layout";

function StudentSchedule() {
  return (
    <DashboardLayout
      title="My Schedule"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">My Class Schedule</h2>
        <p className="text-slate-600">Your class schedule and upcoming events will appear here.</p>
      </div>
    </DashboardLayout>
  );
}

export default StudentSchedule;
import React, { useState } from "react";
import DashboardLayout from "../layout";
import ScheduleCalendar from "../../../components/ScheduleCalendar";
import ScheduleTable from "../../../components/ScheduleTable";
import ButtonProps from "../../../components/ButtonProps";
import { Schedule } from "../../l/schedules/types";
import { RiCalendarLine, RiListCheck2 } from "react-icons/ri";

// Mock data for student schedules
const studentSchedules: Schedule[] = [
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
    title: "Group Project Meeting",
    type: "meeting",
    date: "2024-12-22",
    startTime: "13:00",
    endTime: "14:30",
    location: "Study Room 3",
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Programming Languages Quiz",
    type: "test",
    date: "2024-12-28",
    startTime: "10:00",
    endTime: "11:00",
    location: "Room 202",
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const StudentSchedulesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [schedules] = useState<Schedule[]>(studentSchedules);

  return (
    <DashboardLayout
      title="My Schedule"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="mb-6 flex items-center">
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
          readOnly={true}
        />
      )}
    </DashboardLayout>
  );
};

export default StudentSchedulesPage;
