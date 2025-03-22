import React, { useState } from "react";
import DashboardLayout from "../layout";
import ScheduleCalendar from "../../../components/ScheduleCalendar";
import ScheduleTable from "../../../components/ScheduleTable";
import ButtonProps from "../../../components/ButtonProps";
import { RiCalendarLine, RiListCheck2 } from "react-icons/ri";
import { Schedule } from "../../l/schedules/types";
import { exams, classes, classDetails, studentClassIds } from "../../../data";
import ScheduleEventModal from "../../../components/ScheduleEventModal";

// Convert exams to schedule format
const examSchedules: Schedule[] = exams
  .filter(exam => exam.classId && studentClassIds.includes(exam.classId))
  .map(exam => ({
    id: exam.id.toString(),
    title: exam.title,
    type: exam.type === "exam" ? "examination" : exam.type,
    date: exam.dueDate,
    startTime: exam.startTime,
    endTime: exam.endTime,
    location: `${exam.className} Exam Hall`,
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

// Convert classes to schedule format (weekly recurring)
const classSchedules: Schedule[] = classes
  .filter(cls => studentClassIds.includes(parseInt(cls.id)))
  .map(cls => {
    const details = classDetails[parseInt(cls.id)];
    return {
      id: `class-${cls.id}`,
      title: details?.name || `Class ${cls.id}`,
      type: "class",
      date: "2024-03-25", // Starting date for the semester
      startTime: "09:00", // Default time, should be fetched from actual data
      endTime: "10:30",
      location: `Room ${cls.id}`,
      isRecurring: true,
      recurrence: {
        frequency: "weekly",
        endDate: "2024-07-25", // End of semester date
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

// Combine all schedules
const allSchedules = [...examSchedules, ...classSchedules];

const StudentSchedulePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);

  // Handle event click to show details
  const handleEventClick = (schedule: Schedule) => {
    setSelectedEvent(schedule);
  };

  // Close event details
  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <DashboardLayout
      title="My Schedule"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          My Schedule
        </h1>
        <div className="flex space-x-2 w-full sm:w-auto">
          <ButtonProps
            variant={viewMode === "calendar" ? "primary" : "secondary"}
            onClick={() => setViewMode("calendar")}
            className="flex items-center justify-center gap-2 flex-1 sm:flex-auto py-2 px-4"
            size="small"
          >
            <RiCalendarLine />
            <span className="md:inline">Calendar</span>
          </ButtonProps>
          <ButtonProps
            variant={viewMode === "table" ? "primary" : "secondary"}
            onClick={() => setViewMode("table")}
            className="flex items-center justify-center gap-2 flex-1 sm:flex-auto py-2 px-4"
            size="small"
          >
            <RiListCheck2 />
            <span className="md:inline">Table</span>
          </ButtonProps>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {viewMode === "calendar" ? (
          <div className="p-2 md:p-4">
            <ScheduleCalendar
              schedules={allSchedules}
              onEventClick={handleEventClick}
              onDateSelect={() => {}}
            />
          </div>
        ) : (
          <div className="p-2 md:p-4 overflow-x-auto">
            <ScheduleTable
              schedules={allSchedules}
              onEdit={() => {}}
              onDelete={() => {}}
              viewOnly={true}
            />
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      <ScheduleEventModal
        schedule={selectedEvent!}
        isOpen={selectedEvent !== null}
        onClose={closeEventDetails}
      />
    </DashboardLayout>
  );
};

export default StudentSchedulePage;