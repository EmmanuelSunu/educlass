import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Course, createCourse, updateCourse, getCourseById } from "../../data/courses";
import { Program, getPrograms } from "../../data/programs";
import { Lecturer, getLecturers } from "../../data/lecturers";

const CourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [programs, setPrograms] = useState<Program[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [formData, setFormData] = useState<Omit<Course, "id">>({
    name: "",
    code: "",
    description: "",
    programId: "",
    lecturerId: "",
    credits: 3,
    duration: "14 weeks",
    status: "active",
    level: "100",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    // Load programs and lecturers
    const programsData = getPrograms();
    const lecturersData = getLecturers();
    setPrograms(programsData);
    setLecturers(lecturersData);

    // Load course data if in edit mode
    if (isEditMode && id) {
      const course = getCourseById(id);
      if (course) {
        setFormData({
          name: course.name,
          code: course.code,
          description: course.description,
          programId: course.programId,
          lecturerId: course.lecturerId,
          credits: course.credits,
          duration: course.duration,
          status: course.status,
          level: course.level,
          createdAt: course.createdAt,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }, [isEditMode, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && id) {
      const updated = updateCourse(id, formData);
      if (updated) {
        alert("Course updated successfully!");
        navigate("/admin/courses");
      }
    } else {
      const created = createCourse(formData);
      if (created) {
        alert("Course created successfully!");
        navigate("/admin/courses");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          {isEditMode ? "Edit Course" : "Create Course"}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Program Selection */}
            <div>
              <label
                htmlFor="programId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Program
              </label>
              <select
                id="programId"
                name="programId"
                value={formData.programId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="">Select a program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Selection */}
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Level
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="100">Level 100</option>
                <option value="200">Level 200</option>
                <option value="300">Level 300</option>
                <option value="400">Level 400</option>
              </select>
            </div>

            {/* Course Code */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Enter course code"
              />
            </div>

            {/* Course Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Enter course name"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Enter course description"
              />
            </div>

            {/* Credits */}
            <div>
              <label
                htmlFor="credits"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Credits
              </label>
              <input
                type="number"
                id="credits"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                required
                min="1"
                max="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Enter course credits"
              />
            </div>

            {/* Duration */}
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Enter course duration"
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Lecturer Selection */}
            <div>
              <label
                htmlFor="lecturerId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lecturer
              </label>
              <select
                id="lecturerId"
                name="lecturerId"
                value={formData.lecturerId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="">Select a lecturer</option>
                {lecturers.map((lecturer) => (
                  <option key={lecturer.id} value={lecturer.id}>
                    {lecturer.firstName} {lecturer.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/courses")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isEditMode ? "Update Course" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm; 