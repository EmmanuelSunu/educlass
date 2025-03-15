
import React from 'react';
import { Schedule } from '../user/l/schedules/types';
import ButtonProps from './ButtonProps';

interface ScheduleDetailModalProps {
  schedule: Schedule | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (id: string) => void;
  isLecturer?: boolean;
}

const ScheduleDetailModal: React.FC<ScheduleDetailModalProps> = ({
  schedule,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  isLecturer = false,
}) => {
  if (!isOpen || !schedule) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">{schedule.title}</h2>
        <div className="space-y-3">
          <p><span className="font-medium">Type:</span> {schedule.type}</p>
          <p><span className="font-medium">Date:</span> {schedule.date}</p>
          <p><span className="font-medium">Time:</span> {schedule.startTime} - {schedule.endTime}</p>
          <p><span className="font-medium">Location:</span> {schedule.location}</p>
          {schedule.isRecurring && (
            <p><span className="font-medium">Recurring:</span> {schedule.recurrence?.frequency}</p>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          {isLecturer && (
            <>
              <ButtonProps
                variant="secondary"
                onClick={() => onEdit?.(schedule)}
                size="sm"
              >
                Edit
              </ButtonProps>
              <ButtonProps
                variant="danger"
                onClick={() => {
                  onDelete?.(schedule.id);
                  onClose();
                }}
                size="sm"
              >
                Delete
              </ButtonProps>
            </>
          )}
          <ButtonProps variant="primary" onClick={onClose} size="sm">
            Close
          </ButtonProps>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal;
