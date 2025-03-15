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
    title: "Physics Test",
    type: "test",
    date: "2024-12-28",
    startTime: "11:00",
    endTime: "12:30",
    location: "Room 205",
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const StudentSchedulePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  // Handle event click to show details
  const handleEventClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
  };

  // Close event details
  const closeEventDetails = () => {
    setSelectedSchedule(null);
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
            className="flex items-center justify-center gap-2 flex-1 sm:flex-auto"
            size="sm"
          >
            <RiCalendarLine />
            <span className="md:inline">Calendar</span>
          </ButtonProps>
          <ButtonProps
            variant={viewMode === "table" ? "primary" : "secondary"}
            onClick={() => setViewMode("table")}
            className="flex items-center justify-center gap-2 flex-1 sm:flex-auto"
            size="sm"
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
              schedules={schedules}
              onEventClick={handleEventClick}
              onDateSelect={() => {}}
            />
          </div>
        ) : (
          <div className="p-2 md:p-4 overflow-x-auto">
            <ScheduleTable
              schedules={schedules}
              onEdit={() => {}}
              onDelete={() => {}}
              viewOnly={true}
            />
          </div>
        )}
      </div>
      <ScheduleDetailModal
        schedule={selectedSchedule}
        isOpen={!!selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
        isLecturer={false}
      />
    </DashboardLayout>
  );
};

const ScheduleDetailModal: React.FC<{
  schedule: Schedule | null;
  isOpen: boolean;
  onClose: () => void;
  isLecturer: boolean;
}> = ({ schedule, isOpen, onClose, isLecturer }) => {
  if (!isOpen || !schedule) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Event Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div>
          <div className="mb-3">
            <span className="font-medium text-gray-600">Title:</span>
            <div className="text-gray-800">{schedule.title}</div>
          </div>
          <div className="mb-3">
            <span className="font-medium text-gray-600">Date:</span>
            <div className="text-gray-800">
              {new Date(schedule.date).toLocaleDateString()}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <span className="font-medium text-gray-600">Start Time:</span>
              <div className="text-gray-800">{schedule.startTime}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">End Time:</span>
              <div className="text-gray-800">{schedule.endTime}</div>
            </div>
          </div>
          <div className="mb-3">
            <span className="font-medium text-gray-600">Location:</span>
            <div className="text-gray-800">{schedule.location}</div>
          </div>
          <div className="mb-3">
            <span className="font-medium text-gray-600">Type:</span>
            <div className="text-gray-800 capitalize">{schedule.type}</div>
          </div>
          {schedule.isRecurring && schedule.recurrence && (
            <div className="mb-3">
              <span className="font-medium text-gray-600">Recurrence:</span>
              <div className="text-gray-800">
                {schedule.recurrence.frequency.charAt(0).toUpperCase() +
                  schedule.recurrence.frequency.slice(1)}{" "}
                until{" "}
                {new Date(schedule.recurrence.endDate).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSchedulePage;