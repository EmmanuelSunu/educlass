import React, { useState } from "react";
import ButtonProps from "../../../components/ButtonProps";
import { Schedule } from "./types"; // Ensure this import is correct

interface AddScheduleFormProps {
  onSubmit: (schedule: Schedule) => void;
  onCancel: () => void;
}

const AddScheduleForm: React.FC<AddScheduleFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "class",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "", // Add this line
    isRecurring: false,
    frequency: "weekly" as "daily" | "weekly" | "monthly", // Explicitly type frequency
    endDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checkbox.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSchedule: Schedule = {
      id: `schedule-${Date.now()}`,
      title: formData.title,
      type: formData.type,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      description: formData.description, // Add this line
      isRecurring: formData.isRecurring,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (formData.isRecurring) {
      newSchedule.recurrence = {
        frequency: formData.frequency, // This is now correctly typed
        endDate: formData.endDate,
      };
    }

    onSubmit(newSchedule);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="class">Class</option>
            <option value="examination">Examination</option>
            <option value="studyGroup">Study Group</option>
            <option value="consultation">Consultation</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={2}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isRecurring"
          name="isRecurring"
          checked={formData.isRecurring}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="isRecurring"
          className="ml-2 block text-sm text-gray-700"
        >
          Recurring Event
        </label>
      </div>

      {formData.isRecurring && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required={formData.isRecurring}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-2">
        <ButtonProps variant="secondary" onClick={onCancel}>
          Cancel
        </ButtonProps>
        <ButtonProps variant="primary" type="submit">
          Save Schedule
        </ButtonProps>
      </div>
    </form>
  );
};

export default AddScheduleForm;
