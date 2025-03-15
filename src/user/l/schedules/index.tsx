import { useState } from "react";
import DashboardLayout from "../layout";
import ScheduleCalendar from "../../../components/ScheduleCalendar";
import ScheduleTable from "../../../components/ScheduleTable";
import { RiUploadCloud2Line, RiAddLine } from "react-icons/ri";
import { Schedule } from "./types";
import ScheduleFileUpload from "./ScheduleFileUpload";
import Modal from "../../../components/Modal";
import AddScheduleForm from "./AddScheduleForm";

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

const Schedules = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const isLecturer = true; // Assume lecturer view for simplicity

  const handleEditTable = (schedule: Schedule) => {
    console.log(`Edit schedule with ID: ${schedule.id}`);
  };

  const handleEventClick = (schedule: Schedule) => {
    setSelectedEvent(schedule);
    setShowEventModal(true);
  };

  const handleCloseModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      handleEditTable(selectedEvent);
    }
    handleCloseModal();
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      handleDelete(selectedEvent.id);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  const handleAddSchedule = (newSchedule: Schedule) => {
    const newScheduleWithId = {
      ...newSchedule,
      id: `schedule-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSchedules([...schedules, newScheduleWithId]);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Schedules</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Import Schedule
            </button>
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Schedule
            </button>
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
                onEdit={handleEditTable}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>

        {selectedEvent && (
          <ScheduleEventModal
            schedule={selectedEvent}
            isOpen={showEventModal}
            onClose={handleCloseModal}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            isLecturer={isLecturer}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

// Added ScheduleEventModal Component -  Place this where appropriate in your project structure.
const ScheduleEventModal = ({
  schedule,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  isLecturer,
}: {
  schedule: Schedule | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isLecturer: boolean;
}) => {
  if (!schedule || !isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Event Details">
      <div>
        <h3>{schedule.title}</h3>
        <p>Date: {schedule.date}</p>
        <p>Time: {schedule.startTime} - {schedule.endTime}</p>
        <p>Location: {schedule.location}</p>
        {isLecturer && (
          <>
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default Schedules;