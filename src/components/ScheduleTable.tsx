import React from 'react';
import { Schedule } from '../user/l/schedules/types';
import ButtonProps from './ButtonProps';
import { RiEdit2Line, RiDeleteBinLine } from 'react-icons/ri';

interface ScheduleTableProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (scheduleId: string) => void;
}



const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedules,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Title</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Type</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Start Time</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">End Time</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Location</th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id} className="border-t">
              <td className="px-4 py-2 text-sm text-gray-800">{schedule.title}</td>
              <td className="px-4 py-2 text-sm text-gray-800 capitalize">{schedule.type}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{schedule.date}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{schedule.startTime}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{schedule.endTime}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{schedule.location || '-'}</td>
              <td className="px-4 py-2 text-center">
                <div className="flex justify-center space-x-2">
                  <ButtonProps
                    variant="secondary"
                    onClick={() => onEdit(schedule)}
                    className="gap-2"
                  >
                    <RiEdit2Line />
                    Edit
                  </ButtonProps>
                  <ButtonProps
                    variant="danger"
                    onClick={() => onDelete(schedule.id)}
                    className="gap-2"
                  >
                    <RiDeleteBinLine />
                    Delete
                  </ButtonProps>
                </div>
              </td>
            </tr>
          ))}
          {schedules.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-6 text-center text-gray-500 text-sm"
              >
                No schedules available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
