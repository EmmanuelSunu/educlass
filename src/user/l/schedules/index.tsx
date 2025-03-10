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

const Schedules = () => {
  const [view, setView] = useState<'calendar' | 'table'>('calendar');
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleAddSchedule = (schedule: Schedule) => {
    setSchedules([...schedules, schedule]);
  };

  const handleImportSchedules = (newSchedules: Schedule[]) => {
    setSchedules([...schedules, ...newSchedules]);
    setIsUploadModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Schedule Management</h1>

          <div className="flex items-center space-x-2">
            <div className="bg-slate-100 rounded-lg p-1 flex">
              <button
                className={`px-4 py-2 rounded-md flex items-center ${
                  view === 'calendar' ? 'bg-white shadow-sm' : ''
                }`}
                onClick={() => setView('calendar')}
              >
                <RiCalendarLine className="mr-2" />
                Calendar
              </button>
              <button
                className={`px-4 py-2 rounded-md flex items-center ${
                  view === 'table' ? 'bg-white shadow-sm' : ''
                }`}
                onClick={() => setView('table')}
              >
                <RiListCheck2 className="mr-2" />
                Table
              </button>
            </div>

            <button
              className="p-2 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
              onClick={() => setIsUploadModalOpen(true)}
              title="Upload Schedule Data"
            >
              <RiUploadCloud2Line size={24} />
            </button>
          </div>
        </div>

        {view === 'calendar' ? (
          <ScheduleCalendar schedules={schedules} />
        ) : (
          <ScheduleTable schedules={schedules} />
        )}
      </div>

      {/* Upload Schedule Modal */}
      {isUploadModalOpen && (
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload Schedule Data"
        >
          <ScheduleFileUpload onImport={handleImportSchedules} />
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Schedules;