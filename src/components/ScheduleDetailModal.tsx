
import React from 'react';
import { Schedule } from '../user/l/schedules/types';
import ButtonProps from './ButtonProps';
import { RiEditLine, RiDeleteBinLine, RiCloseLine } from 'react-icons/ri';

interface ScheduleDetailModalProps {
  schedule: Schedule;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isLecturer?: boolean;
}

const ScheduleDetailModal: React.FC<ScheduleDetailModalProps> = ({
  schedule,
  onClose,
  onEdit,
  onDelete,
  isLecturer = false,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-fadeIn">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">{schedule.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Date</h4>
              <p className="text-slate-800">{schedule.date}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Type</h4>
              <p className="text-slate-800 capitalize">{schedule.type}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Start Time</h4>
              <p className="text-slate-800">{schedule.startTime}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">End Time</h4>
              <p className="text-slate-800">{schedule.endTime}</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end space-x-2">
          {isLecturer ? (
            <>
              <ButtonProps
                variant="secondary"
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm"
              >
                <RiEditLine className="w-4 h-4" />
                Edit
              </ButtonProps>
              <ButtonProps
                variant="danger"
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm"
              >
                <RiDeleteBinLine className="w-4 h-4" />
                Delete
              </ButtonProps>
            </>
          ) : (
            <ButtonProps 
              variant="secondary" 
              onClick={onClose}
              className="px-4 py-2 text-sm"
            >
              Close
            </ButtonProps>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal;
