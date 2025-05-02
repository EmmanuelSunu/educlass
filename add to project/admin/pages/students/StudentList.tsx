import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import DashboardLayout from "../../layout";
import { Student, getStudents, deleteStudent } from "../../data/students";
import { Program, getPrograms } from "../../data/programs";

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>(getStudents());
  const [programs] = useState<Program[]>(getPrograms());
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      student.studentId.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      const deleted = deleteStudent(id);
      if (deleted) {
        setStudents(getStudents());
      }
    }
  };

  const getProgramName = (programId: string) => {
    const program = programs.find((p) => p.id === programId);
    return program ? program.name : "Unknown Program";
  };

  return (
    <DashboardLayout 
    title="Students"
    showAddButton
    buttonTitle="Add Student"
    onAddButton={() => navigate("/admin/students/create")}
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-500">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-500">
                    {getProgramName(student.programId)}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-500">
                    {student.level}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-500">
                    {student.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/admin/students/${student.id}/edit`)}
                      className="text-primary hover:text-primary-dark mr-4"
                    >
                      <FiEdit2 className="inline-block" />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">
              {searchTerm
                ? "No students found matching your search criteria."
                : "No students found. Add a student to get started."}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentList; 