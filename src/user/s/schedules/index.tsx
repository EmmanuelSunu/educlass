import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";
import ScheduleCalendar from "../../../components/ScheduleCalendar";
import ScheduleTable from "../../../components/ScheduleTable";
import ButtonProps from "../../../components/ButtonProps";
import { RiCalendarLine, RiListCheck2 } from "react-icons/ri";
import { Schedule } from "../../l/schedules/types";
import { type Exam } from "../../../data/exams/types";
import { type Course } from "../../../data/course/types";
import { getExams } from "../../../data/exams/service";
import { courseService } from "../../../data/course/service";
import { useAuth } from "../../../data/auth/context";
import ScheduleEventModal from "../../../components/ScheduleEventModal";

const StudentSchedulePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        if (!user || !isAuthenticated) {
          navigate('/login');
          return;
        }

        // Load enrolled courses
        const enrolledCourses = await courseService.getCoursesByStudentId(user.id);
        
        // Load exams
        const allExams = await getExams();
        const studentExams = allExams.filter(exam => 
          enrolledCourses.some(course => course.id === exam.classId)
        );

        // Convert exams to schedule format
        const examSchedules: Schedule[] = studentExams.map(exam => ({
          id: exam.id.toString(),
          title: exam.title,
          type: exam.type === "exam" ? "examination" : exam.type,
          date: exam.dueDate,
          startTime: exam.startTime,
          endTime: exam.endTime,
          location: `${exam.className} Exam Hall`,
          isRecurring: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        // Convert course events to schedule format
        const courseSchedules: Schedule[] = enrolledCourses.flatMap(course =>
          course.events.map(event => ({
            id: `event-${event.id}`,
            title: event.title,
            type: event.type,
            date: new Date(event.startTime).toISOString().split('T')[0],
            startTime: new Date(event.startTime).toISOString().split('T')[1].slice(0, 5),
            endTime: new Date(event.endTime).toISOString().split('T')[1].slice(0, 5),
            location: event.location,
            isRecurring: event.recurrence !== "none",
            recurrence: event.recurrence === "none" ? undefined : {
              frequency: event.recurrence,
              endDate: event.endDate || "2024-07-25", // Default to end of semester if not specified
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }))
        );

        // Combine all schedules
        setSchedules([...examSchedules, ...courseSchedules]);
      } catch (error) {
        console.error("Failed to load schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, [user, isAuthenticated, navigate]);

  // Handle event click to show details
  const handleEventClick = (schedule: Schedule) => {
    setSelectedEvent(schedule);
  };

  // Close event details
  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <DashboardLayout
        title="My Schedule"
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RiCalendarLine className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading Schedule</h3>
          <p className="text-slate-600">Please wait while we fetch your schedule.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Schedule"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          My Schedule
        </h1>
        <div className="flex space-x-2 w-full sm:w-auto">
          <ButtonProps
            variant={viewMode === "calendar" ? "primary" : "secondary"}
            onClick={() => setViewMode("calendar")}
            className="flex items-center justify-center gap-2 flex-1 sm:flex-auto py-2 px-4"
            size="small"
          >
            <RiCalendarLine />
            <span className="md:inline">Calendar</span>
          </ButtonProps>
          <ButtonProps
            variant={viewMode === "table" ? "primary" : "secondary"}
            onClick={() => setViewMode("table")}
            className="flex items-center justify-center gap-2 flex-1 sm:flex-auto py-2 px-4"
            size="small"
          >
            <RiListCheck2 />
            <span className="md:inline">Table</span>
          </ButtonProps>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {viewMode === "calendar" ? (
          <div className="p-2 md:p-4">
            <ScheduleCalendar
              schedules={schedules}
              onEventClick={handleEventClick}
              onDateSelect={() => {}}
            />
          </div>
        ) : (
          <div className="p-2 md:p-4 overflow-x-auto">
            <ScheduleTable
              schedules={schedules}
              onEdit={() => {}}
              onDelete={() => {}}
              viewOnly={true}
            />
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      <ScheduleEventModal
        schedule={selectedEvent!}
        isOpen={selectedEvent !== null}
        onClose={closeEventDetails}
      />
    </DashboardLayout>
  );
};

export default StudentSchedulePage;