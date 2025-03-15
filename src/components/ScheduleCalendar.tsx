import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import { Schedule } from "../user/l/schedules/types";
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
  extendedProps: Schedule;
  rrule?: {
    freq: string;
    until: string;
    dtstart: string;
  };
}

const convertToCalendarEvents = (schedules: Schedule[]): CalendarEvent[] => {
  return schedules
    .map((schedule) => {
      try {
        const start = new Date(`${schedule.date}T${schedule.startTime}`);
        const end = new Date(`${schedule.date}T${schedule.endTime}`);
        if (isNaN(start.getTime())) throw new Error("Invalid start date");
        if (isNaN(end.getTime())) throw new Error("Invalid end date");

        const event: CalendarEvent = {
          id: schedule.id,
          title: schedule.title,
          start: start.toISOString(),
          end: end.toISOString(),
          backgroundColor: getEventColor(schedule.type),
          borderColor: getEventColor(schedule.type),
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
    .filter(Boolean) as CalendarEvent[]; // Filter out invalid events
};

const getEventColor = (type: string): string => {
  switch (type) {
    case "class":
      return "#2A9F06";
    case "examination":
      return "#DC2626";
    case "test":
      return "#F59E0B";
    case "meeting":
      return "#3B82F6";
    default:
      return "#6B7280";
  }
};

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  schedules,
  onEventClick,
  onDateSelect,
  onDelete,
  onUpdateSchedule,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 mb-6">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          rrulePlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
        }}
        events={convertToCalendarEvents(schedules)}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={3}
        moreLinkClick="popover"
        weekends={true}
        expandRows={true}
        height="auto"
        eventDisplay="block"
        stickyHeaderDates={true}
        windowResize={(view) => {
          const calendarApi = view.view.calendar;
          if (window.innerWidth < 768) {
            calendarApi.setOption("headerToolbar", {
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridDay",
            });
            calendarApi.setOption("height", "auto");
          } else {
            calendarApi.setOption("headerToolbar", {
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            });
            calendarApi.setOption("height", "800px");
          }
        }}
        select={(selectInfo) => {
          onDateSelect(selectInfo.start, selectInfo.end);
        }}
        eventClick={(clickInfo) => {
          const schedule = schedules.find((s) => s.id === clickInfo.event.id);
          if (schedule) {
            onEventClick(schedule);
          }
        }}
        eventDrop={(dropInfo) => {
          const schedule = schedules.find((s) => s.id === dropInfo.event.id);
          if (schedule && onUpdateSchedule) {
            const updatedSchedule: Schedule = {
              ...schedule,
              date: dropInfo.event.startStr.split("T")[0],
              startTime: dropInfo.event.startStr.split("T")[1],
              endTime: dropInfo.event.endStr.split("T")[1],
            };
            onUpdateSchedule(updatedSchedule);
          }
        }}
        eventResize={(resizeInfo) => {
          const schedule = schedules.find((s) => s.id === resizeInfo.event.id);
          if (schedule && onUpdateSchedule) {
            const updatedSchedule: Schedule = {
              ...schedule,
              endTime: resizeInfo.event.endStr.split("T")[1],
            };
            onUpdateSchedule(updatedSchedule);
          }
        }}
        eventClassNames="cursor-pointer rounded-md"
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        aria-label="Schedule Calendar"
        navLinks={true}
      />

      <div className="mt-6 border-t pt-4 border-slate-100">
        <div className="text-sm">
          <h3 className="font-semibold mb-3 text-slate-700">Schedule Types:</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { type: "class", label: "Class" },
              { type: "examination", label: "Exam" },
              { type: "test", label: "Test" },
              { type: "meeting", label: "Meeting" },
            ].map(({ type, label }) => (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getEventColor(type) }}
                />
                <span className="text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
