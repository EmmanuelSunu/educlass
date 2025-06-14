import { useState, useEffect } from "react";
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
import { Schedule } from "../../../data/schedule/types";
import { scheduleService } from "../../../data/schedule/service";
import ScheduleFileUpload from "./ScheduleFileUpload";
import Modal from "../../../components/Modal";
import AddScheduleForm from "./AddScheduleForm";

const Schedules = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const fetchedSchedules = await scheduleService.getSchedules();
        setSchedules(fetchedSchedules);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };
    fetchSchedules();
  }, []);

  const handleEditTable = async (schedule: Schedule) => {
    try {
      const updatedSchedule = await scheduleService.updateSchedule(schedule.id, schedule);
      if (updatedSchedule) {
        setSchedules(schedules.map(s => s.id === schedule.id ? updatedSchedule : s));
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await scheduleService.deleteSchedule(id);
      if (success) {
        setSchedules(schedules.filter(schedule => schedule.id !== id));
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  const handleAddSchedule = async (newSchedule: Schedule) => {
    try {
      const createdSchedule = await scheduleService.createSchedule(newSchedule);
      setSchedules([...schedules, createdSchedule]);
      setShowAddModal(false);
      setImportSuccess(true);

      setTimeout(() => {
        setImportSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };

  const handleImportSchedules = async (newSchedules: Schedule[]) => {
    try {
      const createdSchedules = await Promise.all(
        newSchedules.map(schedule => scheduleService.createSchedule(schedule))
      );
      setSchedules([...schedules, ...createdSchedules]);
      setShowUploadModal(false);
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error("Error importing schedules:", error);
    }
  };

  return (
    <DashboardLayout
      title="Schedule"
      buttonTitle=""
      showAddHeadbarButton={false}
    >
      <div className="mb-6">
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
        <ScheduleCalendar 
          schedules={schedules} 
          onDelete={handleDelete}
          onEventClick={(schedule) => {
            console.log("Event clicked:", schedule);
            setShowAddModal(true);
          }}
          onDateSelect={() => {
            setShowAddModal(true);
          }}
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
    </DashboardLayout>
  );
};

export default Schedules;
