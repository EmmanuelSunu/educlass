import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import { Schedule } from "../user/l/schedules/types";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import ScheduleEventModal from "./ScheduleEventModal";
import "./calendar-styles.css";

interface ScheduleCalendarProps {
  schedules: Schedule[];
  onEventClick: (schedule: Schedule) => void;
  onDateSelect: (start: Date, end: Date) => void;
  onDelete?: (id: string) => void;
  onUpdateSchedule?: (updatedSchedule: Schedule) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: Schedule;
  rrule?: {
    freq: string;
    until: string;
    dtstart: string;
  };
}

export const getEventColors = (type: string): { bg: string; border: string; text: string } => {
  switch (type) {
    case "class":
      return {
        bg: "#ECFDF5",
        border: "#34D399",
        text: "#065F46"
      };
    case "examination":
      return {
        bg: "#FEF2F2",
        border: "#F87171",
        text: "#991B1B"
      };
    case "test":
      return {
        bg: "#FFFBEB",
        border: "#FBBF24",
        text: "#92400E"
      };
    case "meeting":
      return {
        bg: "#EFF6FF",
        border: "#60A5FA",
        text: "#1E40AF"
      };
    default:
      return {
        bg: "#F9FAFB",
        border: "#9CA3AF",
        text: "#374151"
      };
  }
};

const convertToCalendarEvents = (schedules: Schedule[]): CalendarEvent[] => {
  return schedules
    .map((schedule) => {
      try {
        const start = new Date(`${schedule.date}T${schedule.startTime}`);
        const end = new Date(`${schedule.date}T${schedule.endTime}`);
        if (isNaN(start.getTime())) throw new Error("Invalid start date");
        if (isNaN(end.getTime())) throw new Error("Invalid end date");

        const colors = getEventColors(schedule.type);
        const event: CalendarEvent = {
          id: schedule.id,
          title: schedule.title,
          start: start.toISOString(),
          end: end.toISOString(),
          backgroundColor: colors.bg,
          borderColor: colors.border,
          textColor: colors.text,
          extendedProps: { ...schedule },
        };

        if (schedule.isRecurring && schedule.recurrence) {
          event.rrule = {
            freq: schedule.recurrence.frequency.toUpperCase(),
            until: schedule.recurrence.endDate,
            dtstart: event.start,
          };
        }

        return event;
      } catch (error) {
        console.error("Error converting schedule to calendar event:", error);
        return null;
      }
    })
    .filter(Boolean) as CalendarEvent[];
};

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  schedules,
  // onEventClick,
  onDateSelect,
  // onDelete,
  // onUpdateSchedule,
}) => {
  const [selectedView, setSelectedView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  const handleViewChange = (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => {
    setSelectedView(view);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      {/* Calendar Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <FiCalendar size={20} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Schedule Calendar</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleViewChange('dayGridMonth')}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedView === 'dayGridMonth'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => handleViewChange('timeGridWeek')}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedView === 'timeGridWeek'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => handleViewChange('timeGridDay')}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedView === 'timeGridDay'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="p-6">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            rrulePlugin,
          ]}
          initialView={selectedView}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          views={{
            timeGridWeek: {
              dayHeaderFormat: { weekday: 'short', day: 'numeric' },
            },
            timeGridDay: {
              dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'long' },
            }
          }}
          events={convertToCalendarEvents(schedules)}
          editable={false}
          selectable={false}
          droppable={false}
          eventStartEditable={false}
          eventDurationEditable={false}
          eventResizableFromStart={false}
          eventOverlap={false}
          dayMaxEvents={3}
          moreLinkClick="popover"
          weekends={true}
          expandRows={true}
          height="800px"
          eventDisplay="block"
          stickyHeaderDates={true}
          select={selectInfo => onDateSelect(selectInfo.start, selectInfo.end)}
          eventClick={(info) => {
            info.jsEvent.preventDefault();
            const schedule = info.event.extendedProps as Schedule;
            setSelectedEvent(schedule);
          }}
          eventContent={(eventInfo) => {
            const schedule = eventInfo.event.extendedProps as Schedule;
            const typeLabels: Record<string, string> = {
              class: "Class",
              examination: "Exam",
              test: "Test",
              meeting: "Meeting"
            };
            return (
              <div className="p-2" title={eventInfo.event.title}>
                <div className="font-medium mb-1">{typeLabels[schedule.type] || schedule.type}</div>
                <div className="flex items-center gap-2 text-xs opacity-80">
                  <FiClock />
                  <span>
                    {schedule.startTime.substring(0, 5)} - {schedule.endTime.substring(0, 5)}
                  </span>
                </div>
                {schedule.location && (
                  <div className="flex items-center gap-2 text-xs opacity-80 mt-1">
                    <FiMapPin />
                    <span>{schedule.location}</span>
                  </div>
                )}
              </div>
            );
          }}
          eventClassNames="rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow"
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          navLinks={true}
          nowIndicator={true}
        />
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex flex-wrap gap-6">
          {[
            { type: "class", label: "Classes" },
            { type: "examination", label: "Exams" },
            { type: "test", label: "Tests" },
            { type: "meeting", label: "Meetings" },
          ].map(({ type, label }) => {
            const colors = getEventColors(type);
            return (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: colors.bg,
                    border: `2px solid ${colors.border}`,
                  }}
                />
                <span className="text-sm font-medium" style={{ color: colors.text }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Modal */}
      <ScheduleEventModal
        schedule={selectedEvent!}
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};

export default ScheduleCalendar;
