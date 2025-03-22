import { useState } from "react";
import DashboardLayout from "../layout";
import {
  FiCalendar,
  FiUsers,
  FiUser,
  FiBookOpen,
  FiClock,
  FiBook,
  FiAward
} from "react-icons/fi";
import { exams, classDetails, studentClassIds, Exam } from "../../../data";
import { Dialog } from "@headlessui/react";

interface CourseItem {
  id: number;
  name: string;
  lecturer?: string;
  totalExams?: number;
}

function StudentCourses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  // Get unique courses from exams that the student is enrolled in
  const courses = [
    ...new Set(
      exams
        .filter((exam: Exam) => studentClassIds.includes(exam.classId))
        .map((exam: Exam) => ({
          id: exam.classId,
          name: exam.className,
          lecturer: classDetails[exam.classId as keyof typeof classDetails]?.lecturer,
          totalExams: exams.filter(e => e.classId === exam.classId).length
        }))
    ),
  ];

  const handleViewCourseDetails = (course: CourseItem) => {
    setSelectedCourse(course.id);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout 
      title="My Courses" 
      buttonTitle=""
      showAddHeadbarButton={false}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: CourseItem) => (
            <div
              key={course.id}
              onClick={() => handleViewCourseDetails(course)}
              className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer overflow-hidden"
            >
              {/* Course Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <FiBook size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                      {course.name}
                    </h3>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <FiUser className="text-slate-400" />
                      {course.lecturer || "No lecturer assigned"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Stats */}
              <div className="px-6 py-4 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiAward className="text-primary" />
                  <span className="text-sm font-medium text-slate-700">
                    {course.totalExams} {course.totalExams === 1 ? 'Exam' : 'Exams'}
                  </span>
                </div>
                <span className="text-sm text-primary font-medium group-hover:underline">
                  View Details
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBook className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Courses Found</h3>
            <p className="text-slate-600">You are not enrolled in any courses yet.</p>
          </div>
        )}

        {/* Course Details Modal */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="relative z-50"
        >
          {/* Modal backdrop */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Modal container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-auto p-6">
              <Dialog.Title className="text-2xl font-bold text-slate-900 mb-6">
                {courses.find(c => c.id === selectedCourse)?.name}
              </Dialog.Title>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCalendar className="text-primary" />
                      <span className="text-sm font-medium text-slate-600">Semester</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">
                      {selectedCourse !== null && classDetails[selectedCourse as keyof typeof classDetails]?.semester}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiClock className="text-primary" />
                      <span className="text-sm font-medium text-slate-600">Duration</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">
                      {selectedCourse !== null && classDetails[selectedCourse as keyof typeof classDetails]?.duration}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiUser className="text-primary" />
                    <span className="text-sm font-medium text-slate-600">Lecturer</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {selectedCourse !== null && classDetails[selectedCourse as keyof typeof classDetails]?.lecturer}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiBookOpen className="text-primary" />
                    <h4 className="text-sm font-medium text-slate-600">Course Description</h4>
                  </div>
                  <p className="text-slate-700 bg-slate-50 rounded-lg p-4">
                    {selectedCourse !== null && classDetails[selectedCourse as keyof typeof classDetails]?.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

export default StudentCourses;
