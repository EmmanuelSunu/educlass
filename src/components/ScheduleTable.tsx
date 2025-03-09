import React from 'react';
import { Schedule } from '../user/l/schedules/types';

interface ScheduleTableProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (scheduleId: string) => void;
  viewOnly?: boolean;
}



const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedules,
  onEdit,
  onDelete,
  viewOnly = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 overflow-x-auto">
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <table className="min-w-full divide-y divide-slate-200 table-auto">
          <thead>
            <tr>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                Type
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                Time
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                Location
              </th>
              {!viewOnly && (
                <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-slate-50">
                <td className="px-3 md:px-6 py-3 md:py-4 text-sm font-medium text-slate-900">
                  <div className="truncate max-w-[150px] sm:max-w-none">
                    {schedule.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 sm:hidden">
                    {new Date(schedule.date).toLocaleDateString()} • {schedule.startTime}
                  </div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-slate-700 capitalize hidden sm:table-cell">
                  {schedule.type}
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-slate-700">
                  {new Date(schedule.date).toLocaleDateString()}
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-slate-700 hidden sm:table-cell">
                  {schedule.startTime} - {schedule.endTime}
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-slate-700 hidden md:table-cell">
                  {schedule.location}
                </td>
                {!viewOnly && (
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(schedule)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2 md:mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(schedule.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {schedules.length === 0 && (
              <tr>
                <td colSpan={viewOnly ? 6 : 7} className="px-6 py-8 text-center text-sm text-slate-500">
                  No schedules found. 
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;