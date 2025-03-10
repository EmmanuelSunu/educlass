import React, { useState } from "react";
import DashboardLayout from "../layout";
import ScheduleCalendar from "../../../components/ScheduleCalendar";
import ScheduleTable from "../../../components/ScheduleTable";
import ButtonProps from "../../../components/ButtonProps";
import { RiCalendarLine, RiListCheck2, RiUploadCloud2Line, RiAddLine } from "react-icons/ri";
import { Schedule } from "./types";
import ScheduleFileUpload from "./ScheduleFileUpload";
import Modal from '../../../components/Modal';


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

  const handleEdit = (id: string) => {
    console.log(`Edit schedule with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  return (
    <DashboardLayout title="Schedule" buttonTitle="" showAddHeadbarButton={false}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Schedule Management</h1>

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
              onClick={() => console.log("Add schedule clicked")}
              className="flex gap-2 items-center"
            >
              <RiAddLine />
              Add Schedule
            </ButtonProps>
          </div>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <ScheduleCalendar schedules={schedules} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <ScheduleTable schedules={schedules} onEdit={handleEdit} onDelete={handleDelete} />
      )}


      {/* Upload Schedule Modal */}
      {showUploadModal && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload Schedule Data"
        >
          <ScheduleFileUpload onImport={() => {}} /> {/* Placeholder for import functionality */}
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Schedules;