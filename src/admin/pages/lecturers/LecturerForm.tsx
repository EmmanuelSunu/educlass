import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lecturer, createLecturer, updateLecturer, getLecturerById } from "../../data/lecturers";

const LecturerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Omit<Lecturer, "id" | "createdAt" | "updatedAt">>({
    staffId: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    if (isEditMode && id) {
      const lecturer = getLecturerById(id);
      if (lecturer) {
        setFormData({
          staffId: lecturer.staffId,
          firstName: lecturer.firstName,
          lastName: lecturer.lastName,
          email: lecturer.email,
          department: lecturer.department,
        });
      }
    }
  }, [isEditMode, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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
      const updated = updateLecturer(id, formData);
      if (updated) {
        alert("Lecturer updated successfully!");
        navigate("/admin/lecturers");
      }
    } else {
      const created = createLecturer(formData);
      if (created) {
        alert("Lecturer created successfully!");
        navigate("/admin/lecturers");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          {isEditMode ? "Edit Lecturer" : "Create Lecturer"}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Staff ID */}
            <div>
              <label
                htmlFor="staffId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Staff ID
              </label>
              <input
                type="text"
                id="staffId"
                name="staffId"
                value={formData.staffId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Enter staff ID"
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

            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Enter department"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/lecturers")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isEditMode ? "Update Lecturer" : "Create Lecturer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LecturerForm; 