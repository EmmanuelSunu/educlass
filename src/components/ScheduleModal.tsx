import React, { useState } from 'react';
import { Schedule, ScheduleType } from '../user/l/schedules/types';
import ButtonProps from './ButtonProps';
import { RiCloseLine } from 'react-icons/ri';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: Partial<Schedule>) => void;
  schedule?: Schedule;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  schedule
}) => {
  const [formData, setFormData] = useState<Partial<Schedule>>(
    schedule || {
      title: '',
      type: 'class',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      isRecurring: false,
      recurrence: undefined
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleRecurrenceChange = (isRecurring: boolean) => {
    setFormData(prev => ({
      ...prev,
      isRecurring,
      recurrence: isRecurring 
        ? { frequency: 'weekly', endDate: '' }  // Initialize with default values
        : undefined  // Remove recurrence when not recurring
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <RiCloseLine size={24} />
          </button>

          <h2 className="text-xl font-semibold mb-4">
            {schedule ? 'Edit Schedule' : 'Add New Schedule'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ScheduleType })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              >
                <option value="class">Class</option>
                <option value="examination">Examination</option>
                <option value="test">Test</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => handleRecurrenceChange(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Recurring Schedule</label>
            </div>

            {formData.isRecurring && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frequency</label>
                  <select
                    value={formData.recurrence?.frequency}
                    onChange={(e) => setFormData({
                      ...formData,
                      recurrence: {
                        frequency: e.target.value as 'daily' | 'weekly' | 'monthly',
                        endDate: formData.recurrence?.endDate || ''
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={formData.recurrence?.endDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      recurrence: {
                        frequency: formData.recurrence?.frequency || 'weekly',
                        endDate: e.target.value
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <ButtonProps
                variant="secondary"
                onClick={onClose}
                type="button"
              >
                Cancel
              </ButtonProps>
              <ButtonProps
                variant="primary"
                type="submit"
              >
                {schedule ? 'Update' : 'Create'}
              </ButtonProps>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;