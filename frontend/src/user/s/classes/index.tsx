import { useState, useEffect } from "react";
import DashboardLayout from "../layout";
import { FiBook } from "react-icons/fi";
import { type Course } from "../../../data/course/types";
import { courseService } from "../../../data/course/service";
import ClassCard from "../../../components/classCard";

function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        // TODO: Replace with actual student ID from auth context
        const studentId = 1;
        const enrolledCourses = await courseService.getCoursesByStudentId(studentId);
        setCourses(enrolledCourses);
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return (
      <DashboardLayout 
        title="My Courses" 
        buttonTitle=""
        showAddHeadbarButton={false}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBook className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading Courses</h3>
            <p className="text-slate-600">Please wait while we fetch your courses.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="My Courses" 
      buttonTitle=""
      showAddHeadbarButton={false}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBook className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Courses Found</h3>
            <p className="text-slate-600">You are not enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <ClassCard
                key={course.id}
                code={course.code}
                name={course.name}
                level={course.level}
                status="Active"
                semester={course.semester}
                instructorId={`LEC${String(course.lecturerId).padStart(3, '0')}`}
                description={course.description}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentCourses;
