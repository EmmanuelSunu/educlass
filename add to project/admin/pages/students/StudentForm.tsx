import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layout";
import { Student, createStudent, updateStudent, getStudentById } from "../../data/students";
import { Program, getPrograms } from "../../data/programs";

const StudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [programs, setPrograms] = useState<Program[]>([]);
  const [formData, setFormData] = useState<Omit<Student, "id" | "createdAt" | "updatedAt">>({
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    programId: "",
    level: "",
    semester: "",
    enrolledCourses: [],
  });

  useEffect(() => {
    // Load programs
    const programsData = getPrograms();
    setPrograms(programsData);

    // Load student data if in edit mode
    if (isEditMode && id) {
      const student = getStudentById(id);
      if (student) {
        setFormData({
          studentId: student.studentId,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          programId: student.programId,
          level: student.level,
          semester: student.semester,
          enrolledCourses: student.enrolledCourses,
        });
      }
    }
  }, [isEditMode, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      const updated = updateStudent(id, formData);
      if (updated) {
        alert("Student updated successfully!");
        navigate("/admin/students");
      }
    } else {
      const created = createStudent(formData);
      if (created) {
        alert("Student created successfully!");
        navigate("/admin/students");
      }
    }
  };

  return (
    <DashboardLayout title={isEditMode ? "Edit Student" : "Create Student"}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Student ID */}
            <div>
              <label
                htmlFor="studentId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Enter student ID"
              />
            </div>

            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Enter first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Enter last name"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Enter email address"
              />
            </div>

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

            {/* Level */}
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
                <option value="">Select level</option>
                <option value="100">Level 100</option>
                <option value="200">Level 200</option>
                <option value="300">Level 300</option>
                <option value="400">Level 400</option>
              </select>
            </div>

            {/* Semester */}
            <div>
              <label
                htmlFor="semester"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Semester
              </label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="">Select semester</option>
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/students")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isEditMode ? "Update Student" : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default StudentForm; 