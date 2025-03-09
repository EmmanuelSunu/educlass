import React, { useState } from "react";
import DashboardLayout from "../layout";
import ScheduleCalendar from "../../../components/ScheduleCalendar";
import ScheduleTable from "../../../components/ScheduleTable";
import ButtonProps from "../../../components/ButtonProps";
import { RiCalendarLine, RiListCheck2, RiUploadCloud2Line } from "react-icons/ri";
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

const LecturerSchedulePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [allSchedules, setAllSchedules] = useState<Schedule[]>(mockSchedules);
  const [showUploadModal, setShowUploadModal] = useState(false);


  const handleSchedulesImported = (importedSchedules: Schedule[]) => {
    // Merge imported schedules with existing ones
    setAllSchedules(prevSchedules => {
      // Create a new array with both sets of schedules
      const combined = [...prevSchedules, ...importedSchedules];

      // Alert the user about the import
      window.alert(`Successfully imported ${importedSchedules.length} schedule items.`);

      return combined;
    });
    setShowUploadModal(false); // Close modal after successful import
  };

  return (
    <DashboardLayout>
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
          <ButtonProps
            variant="accent" // Added accent variant for upload button
            onClick={() => setShowUploadModal(true)}
            className="gap-2"
          >
            <RiUploadCloud2Line />
            Upload
          </ButtonProps>
        </div>
      </div>

      {/* File Upload Modal */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
        <ScheduleFileUpload onSchedulesImported={handleSchedulesImported} />
      </Modal>

      {viewMode === "calendar" ? (
        <ScheduleCalendar schedules={allSchedules} />
      ) : (
        <ScheduleTable schedules={allSchedules} />
      )}
    </DashboardLayout>
  );
};

export default LecturerSchedulePage;