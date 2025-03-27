// pages/class/index.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../layout";
import ClassCard from "../../../components/classCard";
import { type Course } from "../../../data/course/types";
import { courseService } from "../../../data/course/service";
import { FiBook } from "react-icons/fi";

function ClassIndex() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        // TODO: Replace with actual lecturer ID from auth context
        const lecturerId = 1;
        const lecturerCourses = await courseService.getCoursesByLecturerId(lecturerId);
        setCourses(lecturerCourses);
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
        title="Classes"
        showAddHeadbarButton={false}
        buttonTitle=""
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBook className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading Classes</h3>
          <p className="text-slate-600">Please wait while we fetch your classes.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Classes"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
    </DashboardLayout>
  );
}

export default ClassIndex;