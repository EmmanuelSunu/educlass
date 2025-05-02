import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import DashboardLayout from "../../layout";
import { useNavigate } from "react-router-dom";
import { Lecturer, getLecturers, deleteLecturer } from "../../data/lecturers";

const LecturerList = () => {
  const navigate = useNavigate();
  const [lecturers, setLecturers] = useState<Lecturer[]>(getLecturers());
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLecturers = lecturers.filter(
    (lecturer) =>
      lecturer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.staffId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this lecturer?")) {
      const success = deleteLecturer(id);
      if (success) {
        setLecturers(getLecturers());
      }
    }
  };

  return (
    <DashboardLayout
      title="Lecturers"
      showAddButton={true}
      buttonTitle="Add Lecturer"
      onAddButton={() => navigate("/admin/lecturers/create")}
    >
      <div className="bg-white rounded-lg shadow-md">
        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search lecturers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Lecturers Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLecturers.map((lecturer) => (
                <tr key={lecturer.id}>
                  <td className="px-6 py-4 whitespace-wrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lecturer.staffId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-wrap">
                    <div className="text-sm text-gray-900">
                      {lecturer.firstName} {lecturer.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-wrap">
                    <div className="text-sm text-gray-500">{lecturer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-wrap">
                    <div className="text-sm text-gray-500">{lecturer.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => navigate(`/admin/lecturers/${lecturer.id}/edit`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lecturer.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredLecturers.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Lecturers Found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search"
                : "Get started by adding a new lecturer"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate("/admin/lecturers/create")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <FiPlus className="mr-2" /> Add Lecturer
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LecturerList; 