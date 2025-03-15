
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{schedule.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <span className="w-24 text-gray-500">Type:</span>
              <span className="capitalize">{schedule.type}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="w-24 text-gray-500">Date:</span>
              <span>{schedule.date}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="w-24 text-gray-500">Time:</span>
              <span>{schedule.startTime} - {schedule.endTime}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="w-24 text-gray-500">Location:</span>
              <span>{schedule.location}</span>
            </div>
          </div>
        </div>

        {isLecturer && (
          <div className="flex justify-end gap-2 p-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleEventModal;
