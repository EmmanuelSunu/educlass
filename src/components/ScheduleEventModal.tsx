
import React from 'react';
import { Schedule } from '../user/l/schedules/types';

interface ScheduleEventModalProps {
  schedule: Schedule;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isLecturer?: boolean;
}

const ScheduleEventModal: React.FC<ScheduleEventModalProps> = ({
  schedule,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  isLecturer = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">{schedule.title}</h2>
        <div className="space-y-2 mb-4">
          <p><span className="font-medium">Type:</span> {schedule.type}</p>
          <p><span className="font-medium">Date:</span> {schedule.date}</p>
          <p><span className="font-medium">Time:</span> {schedule.startTime} - {schedule.endTime}</p>
          <p><span className="font-medium">Location:</span> {schedule.location}</p>
        </div>
        <div className="flex justify-end gap-2">
          {isLecturer && (
            <>
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEventModal;
