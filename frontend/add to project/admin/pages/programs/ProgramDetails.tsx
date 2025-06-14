import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiEdit2, FiArrowLeft, FiPlus, FiX, FiTrash2 } from "react-icons/fi";
import DashboardLayout from "../../layout";
import { Program, getProgramById } from "../../data/programs";
import { Course, getCourses, getCoursesByProgram, updateCourse } from "../../data/courses";

const ProgramDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Load program details
    const programData = getProgramById(id || "");
    setProgram(programData || null);

    // Load courses for this program
    const programCourses = getCoursesByProgram(id || "");
    setCourses(programCourses);
    setFilteredCourses(programCourses);
  }, [id]);

  const handleFilterChange = () => {
    let filtered = courses;
    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter);
    }
    setFilteredCourses(filtered);
  };

  const handleAddCourse = () => {
    setIsModalOpen(true);
    // Load all available courses
    const allCourses = getCourses();
    // Filter out courses that are already in the program
    const available = allCourses.filter(
      (course) => !courses.some((c) => c.id === course.id)
    );
    setAvailableCourses(available);
    setSelectedCourses([]);
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourses((prev) => {
      const isSelected = prev.some((c) => c.id === course.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== course.id);
      } else {
        return [...prev, course];
      }
    });
  };

  const handleSaveCourses = () => {
    // Update selected courses to belong to this program
    selectedCourses.forEach((course) => {
      updateCourse(course.id, { programId: id || "" });
    });
    // Update the courses list
    const updatedCourses = getCoursesByProgram(id || "");
    setCourses(updatedCourses);
    setFilteredCourses(updatedCourses);
    setIsModalOpen(false);
  };

  const handleRemoveCourse = (courseId: string) => {
    if (window.confirm("Are you sure you want to remove this course from the program?")) {
      updateCourse(courseId, { programId: "" });
      const updatedCourses = getCoursesByProgram(id || "");
      setCourses(updatedCourses);
      setFilteredCourses(updatedCourses);
    }
  };

  if (!program) {
    return (
      <DashboardLayout title="Program Details">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Program Details">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/programs")}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {program.name}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Program ID: {program.id}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/admin/programs/${id}/edit`)}
            className="flex items-center px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
          >
            <FiEdit2 className="w-4 h-4 mr-2" />
            Edit Program
          </button>
        </div>

        {/* Program Details */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 border-b md:border-b-0 md:border-r border-slate-200">
              <h2 className="text-lg font-medium text-slate-900 mb-4">
                Program Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    {program.description}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duration
                  </label>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    {program.duration}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-lg font-medium text-slate-900 mb-4">
                Program Statistics
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Total Courses
                  </label>
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <p className="text-3xl font-bold text-primary">
                      {courses.length}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Courses in this program
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Created At
                    </label>
                    <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      {new Date(program.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Updated
                    </label>
                    <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      {new Date(program.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-slate-900">Program Courses</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage the courses offered in this program
                </p>
              </div>
              <button
                onClick={handleAddCourse}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Course
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    handleFilterChange();
                  }}
                  className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Courses Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-wrap">
                      <div className="text-sm font-medium text-gray-900">
                        {course.code}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{course.name}</div>
                      <div className="text-sm text-gray-500">{course.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-wrap">
                      <div className="text-sm text-gray-500">{course.credits}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-wrap">
                      <div className="text-sm text-gray-500">{course.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-wrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-wrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveCourse(course.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Course Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-slate-900">
                    Add Courses to Program
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <FiX className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {availableCourses.map((course) => (
                    <div
                      key={course.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        selectedCourses.some((c) => c.id === course.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200'
                      }`}
                    >
                      <div>
                        <h4 className="font-medium text-slate-900">{course.name}</h4>
                        <p className="text-sm text-slate-500">{course.code}</p>
                      </div>
                      <button
                        onClick={() => handleCourseSelect(course)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          selectedCourses.some((c) => c.id === course.id)
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {selectedCourses.some((c) => c.id === course.id)
                          ? 'Selected'
                          : 'Select'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-slate-200">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCourses}
                    disabled={selectedCourses.length === 0}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Selected Courses
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProgramDetails; 