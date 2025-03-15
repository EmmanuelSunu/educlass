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

const Schedules = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [showAddModal, setShowAddModal] = useState(false); // State for Add Schedule Modal
  const [importSuccess, setImportSuccess] = useState(false); // State for import success indicator
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  // For ScheduleTable, onEdit expects a Schedule object.
  const handleEditTable = (schedule: Schedule) => {
    console.log(`Edit schedule with ID: ${schedule.id}`);
  };

  const handleDelete = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  const handleAddSchedule = (newSchedule: Schedule) => {
    // Generate a unique ID for the new schedule
    const newScheduleWithId = {
      ...newSchedule,
      id: `schedule-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSchedules([...schedules, newScheduleWithId]);
    setShowAddModal(false);
    setImportSuccess(true); // Show success message after adding

    // Hide success message after 3 seconds
    setTimeout(() => {
      setImportSuccess(false);
    }, 3000);
  };

  const handleImportSchedules = (newSchedules: Schedule[]) => {
    setSchedules([...schedules, ...newSchedules]);
    setShowUploadModal(false);
    setShowSuccessPopup(true);

    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  };

  const handleEventClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleEdit = () => {
    // Add edit functionality
    console.log("Edit schedule:", selectedSchedule);
  };

  const closeEventDetails = () => {
    setSelectedSchedule(null);
  };

  const handleDelete = () => {
    // Add delete functionality
    console.log("Delete schedule:", selectedSchedule);
    setSelectedSchedule(null);
  };

  return (
    <DashboardLayout
      title="Schedule"
      buttonTitle=""
      showAddHeadbarButton={false}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Schedule Management
        </h1>

        <div className="flex justify-between items-center">
          {/* Group 1 - View toggles (left side) */}
          <div className="flex space-x-2">
            <ButtonProps
              variant={viewMode === "calendar" ? "primary" : "secondary"}
              onClick={() => setViewMode("calendar")}
              className="flex gap-2 items-center"
            >
              <RiCalendarLine />
              Calendar
            </ButtonProps>
            <ButtonProps
              variant={viewMode === "table" ? "primary" : "secondary"}
              onClick={() => setViewMode("table")}
              className="flex gap-2 items-center"
            >
              <RiListCheck2 />
              Table
            </ButtonProps>
          </div>

          {/* Group 2 - Action buttons (right side) */}
          <div className="flex space-x-2">
            <ButtonProps
              variant="secondary"
              onClick={() => setShowUploadModal(true)}
              className="flex gap-2 items-center"
            >
              <RiUploadCloud2Line />
              Upload
            </ButtonProps>
            <ButtonProps
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="flex gap-2 items-center"
            >
              <RiAddLine />
              Add Schedule
            </ButtonProps>
          </div>
        </div>
      </div>

      {viewMode === "calendar" ? (
        // Removed unsupported onEdit prop for ScheduleCalendar
        <ScheduleCalendar 
          schedules={schedules} 
          onDelete={handleDelete}
          onEventClick={handleEventClick}
          onDateSelect={() => setShowAddModal(true)}
        />
      ) : (
        <ScheduleTable
          schedules={schedules}
          onEdit={handleEditTable}
          onDelete={handleDelete}
        />
      )}

      {/* Upload Schedule Modal */}
      {showUploadModal && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload Schedule Data"
        >
          <ScheduleFileUpload onImport={handleImportSchedules} />
        </Modal>
      )}

      {/* Add Schedule Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Schedule"
        >
          <AddScheduleForm
            onSubmit={handleAddSchedule}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {/* Success message after import */}
      {importSuccess && (
        <div className="bg-green-200 text-green-700 p-4 rounded mt-4">
          Schedules imported successfully!
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2">Import Successful!</h2>
            <p className="text-gray-600 text-center">
              Schedules have been imported successfully.
            </p>
          </div>
        </div>
      )}
      {selectedSchedule && (
        <ScheduleDetailModal
          schedule={selectedSchedule}
          onClose={closeEventDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLecturer={true}
        />
      )}
    </DashboardLayout>
  );
};

export default Schedules;