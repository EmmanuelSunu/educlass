import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Schedule } from '../user/l/schedules/types';

interface ScheduleCalendarProps {
  schedules: Schedule[];
  onEventClick: (schedule: Schedule) => void;
  onDateSelect: (start: Date, end: Date) => void;
}

// Helper function to convert schedules to FullCalendar events
const convertToCalendarEvents = (schedules: Schedule[]) => {
  return schedules.map(schedule => ({
    id: schedule.id,
    title: schedule.title,
    start: `${schedule.date}T${schedule.startTime}`,
    end: `${schedule.date}T${schedule.endTime}`,
    backgroundColor: getEventColor(schedule.type),
    borderColor: getEventColor(schedule.type),
    extendedProps: { ...schedule }
  }));
};

// Helper function to get color based on schedule type
const getEventColor = (type: string) => {
  switch (type) {
    case 'class':
      return '#4F46E5'; // Indigo
    case 'examination':
      return '#DC2626'; // Red
    case 'test':
      return '#EA580C'; // Orange
    case 'meeting':
      return '#059669'; // Green
    default:
      return '#6B7280'; // Gray
  }
};

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  schedules,
  onEventClick,
  onDateSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={convertToCalendarEvents(schedules)}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        expandRows={true}
        height="auto"
        select={(selectInfo) => {
          onDateSelect(selectInfo.start, selectInfo.end);
        }}
        eventClick={(clickInfo) => {
          const schedule = schedules.find(s => s.id === clickInfo.event.id);
          if (schedule) {
            onEventClick(schedule);
          }
        }}
        eventClassNames="cursor-pointer"
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
      />

      <div className="mt-4 flex gap-4">
        <div className="text-sm">
          <h3 className="font-medium mb-2">Schedule Types:</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { type: 'class', label: 'Class' },
              { type: 'examination', label: 'Exam' },
              { type: 'test', label: 'Test' },
              { type: 'meeting', label: 'Meeting' }
            ].map(({ type, label }) => (
              <div key={type} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getEventColor(type) }}
                />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;