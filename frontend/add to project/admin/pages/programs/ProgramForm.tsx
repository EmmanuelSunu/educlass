import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layout";
import { Program, getProgramById, createProgram, updateProgram } from "../../data/programs";

const ProgramForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Omit<Program, "id" | "createdAt" | "updatedAt">>({
    name: "",
    description: "",
    duration: "4 years",
    courses: [],
  });

  useEffect(() => {
    if (isEditMode && id) {
      const program = getProgramById(id);
      if (program) {
        setFormData({
          name: program.name,
          description: program.description,
          duration: program.duration,
          courses: program.courses,
        });
      }
    }
  }, [isEditMode, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      const updated = updateProgram(id, formData);
      if (updated) {
        alert("Program updated successfully!");
        navigate("/admin/programs");
      }
    } else {
      const created = createProgram(formData);
      if (created) {
        alert("Program created successfully!");
        navigate("/admin/programs");
      }
    }
  };

  return (
    <DashboardLayout
      title={isEditMode ? "Edit Program" : "Create Program"}
      showAddButton={false}
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Program Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Enter program name"
              />
            </div>

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
                placeholder="Enter program description"
              />
            </div>

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
                readOnly
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/programs")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isEditMode ? "Update Program" : "Create Program"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProgramForm; 