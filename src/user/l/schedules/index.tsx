import { useState } from "react";
import DashboardLayout from "../layout";
import ScheduleCalendar from "../../../components/ScheduleCalendar";
import ScheduleTable from "../../../components/ScheduleTable";
import ButtonProps from "../../../components/ButtonProps";
import {
  RiCalendarLine,
  RiListCheck2,
  RiUploadCloud2Line,
  RiAddLine,
} from "react-icons/ri";
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

const LecturerSchedulePage = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const handleEventClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleEdit = () => {
    console.log("Edit schedule:", selectedSchedule);
  };

  const handleDelete = () => {
    console.log("Delete schedule:", selectedSchedule);
    setSelectedSchedule(null);
  };

  const closeEventDetails = () => {
    setSelectedSchedule(null);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-slate-800">Schedule Management</h1>
          <div className="flex gap-3">
            <ButtonProps
              onClick={() => setShowAddModal(true)}
              variant="primary"
              icon={<RiAddLine />}
            >
              Add Schedule
            </ButtonProps>
            <ButtonProps
              onClick={() => setShowUploadModal(true)}
              variant="secondary"
              icon={<RiUploadCloud2Line />}
            >
              Upload Schedule
            </ButtonProps>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <ButtonProps
              onClick={() => setViewMode("calendar")}
              variant={viewMode === "calendar" ? "primary" : "secondary"}
              icon={<RiCalendarLine />}
            >
              Calendar View
            </ButtonProps>
            <ButtonProps
              onClick={() => setViewMode("table")}
              variant={viewMode === "table" ? "primary" : "secondary"}
              icon={<RiListCheck2 />}
            >
              Table View
            </ButtonProps>
          </div>
        </div>

        {viewMode === "calendar" ? (
          <ScheduleCalendar
            schedules={mockSchedules}
            onEventClick={handleEventClick}
          />
        ) : (
          <ScheduleTable
            schedules={mockSchedules}
            onEdit={handleEventClick}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Schedule"
      >
        <ScheduleFileUpload onClose={() => setShowUploadModal(false)} />
      </Modal>

      {/* Add Schedule Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Schedule"
      >
        <AddScheduleForm onClose={() => setShowAddModal(false)} />
      </Modal>

      {selectedSchedule && (
        <Modal
          isOpen={!!selectedSchedule}
          onClose={closeEventDetails}
          title="Schedule Details"
        >
          <div className="p-4">
            <h2>{selectedSchedule.title}</h2>
            <p>Date: {selectedSchedule.date}</p>
            <p>Time: {selectedSchedule.startTime} - {selectedSchedule.endTime}</p>
            <p>Location: {selectedSchedule.location}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default LecturerSchedulePage;