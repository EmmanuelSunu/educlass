import React from 'react';
import { Schedule } from '../user/l/schedules/types';

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
              <td className="px-6 py-4 text-sm text-slate-700">{schedule.location || '-'}</td>
              <td className="px-6 py-4 flex justify-center space-x-3">
                <button
                  onClick={() => onEdit(schedule)}
                  className="p-1.5 rounded-md text-primary hover:bg-primary/10 transition-colors"
                  aria-label="Edit schedule"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(schedule.id)}
                  className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Delete schedule"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
          {schedules.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                No schedules found. 
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;