import React, { useState } from "react";
import DashboardLayout from "../layout";
import ScheduleModal from "../../../components/ScheduleModal";
import ScheduleCalendar from "../../../components/ScheduleCalendar";
import ScheduleTable from "../../../components/ScheduleTable";
import ButtonProps from "../../../components/ButtonProps";
import { Schedule } from "./types";
import { RiAddLine, RiCalendarLine, RiListCheck2 } from "react-icons/ri";

// Mock data for demonstration
const mockSchedules: Schedule[] = [
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
];

const SchedulesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [selectedSchedule, setSelectedSchedule] = useState<
    Schedule | undefined
  >();
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);

  const handleAddSchedule = (scheduleData: Partial<Schedule>) => {
    const newSchedule: Schedule = {
      ...scheduleData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Schedule;

    setSchedules([...schedules, newSchedule]);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleDateSelect = (start: Date, end: Date) => {
    setSelectedSchedule(undefined);
    setIsModalOpen(true);
  };

  const handleAddHeadbarButton = () => {
    // Handle adding exam logic here
    console.log("Add clicked");
  };

  return (
    <DashboardLayout
      title="Schedules"
      showAddHeadbarButton={false}
      onAddHeadbarButton={handleAddHeadbarButton}
      buttonTitle="Add Schedule"
    >
      <div className="mb-6 flex justify-between items-center">
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

        <ButtonProps
          variant="primary"
          onClick={() => {
            setSelectedSchedule(undefined);
            setIsModalOpen(true);
          }}
          className="gap-2"
        >
          <RiAddLine />
          Add Schedule
        </ButtonProps>
      </div>

      {viewMode === "calendar" ? (
        <ScheduleCalendar
          schedules={schedules}
          onEventClick={handleEditSchedule}
          onDateSelect={handleDateSelect}
        />
      ) : (
        <ScheduleTable
          schedules={schedules}
          onEdit={handleEditSchedule}
          onDelete={(scheduleId) =>
            setSchedules((prev) => prev.filter((s) => s.id !== scheduleId))
          }
        />
      )}

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSchedule(undefined);
        }}
        onSave={handleAddSchedule}
        schedule={selectedSchedule}
      />
    </DashboardLayout>
  );
};

export default SchedulesPage;
