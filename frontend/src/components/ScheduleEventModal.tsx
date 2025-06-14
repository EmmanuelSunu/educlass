import React from 'react';
import { Schedule } from '../data/schedule/types';
import { Course } from '../data/course/types';
import { FiClock, FiMapPin, FiCalendar, FiTag, FiBook } from 'react-icons/fi';
import { getEventColors } from './ScheduleCalendar';

interface ScheduleEventModalProps {
  schedule: Schedule;
  course?: Course;
  onClose: () => void;
}

const ScheduleEventModal: React.FC<ScheduleEventModalProps> = ({
  schedule,
  course,
  onClose
}) => {
  const colors = getEventColors(schedule.type);
  const typeLabels: Record<string, string> = {
    class: "Class",
    examination: "Exam",
    studyGroup: "Study Group",
    consultation: "Consultation"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="p-4 border-b" style={{ backgroundColor: colors.bg }}>
          <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
            {schedule.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <FiTag className="opacity-70" />
            <span className="text-sm" style={{ color: colors.text }}>
              {typeLabels[schedule.type] || schedule.type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <FiCalendar className="text-gray-500" />
            <span>{new Date(schedule.date).toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <FiClock className="text-gray-500" />
            <span>{schedule.startTime.substring(0, 5)} - {schedule.endTime.substring(0, 5)}</span>
          </div>

          {schedule.location && (
            <div className="flex items-center gap-3">
              <FiMapPin className="text-gray-500" />
              <span>{schedule.location}</span>
            </div>
          )}

          {course && (
            <div className="flex items-center gap-3">
              <FiBook className="text-gray-500" />
              <span>{course.code} - {course.name}</span>
            </div>
          )}

          {schedule.description && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
              <p className="text-sm text-gray-600">{schedule.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEventModal; 