import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Student, getStudents, deleteStudent } from "../../data/students";
import { Program, getPrograms } from "../../data/programs";

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>(getStudents());
  const [programs] = useState<Program[]>(getPrograms());
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      const success = deleteStudent(id);
      if (success) {
        setStudents(getStudents());
      }
    }
  };

  const handleAddStudent = () => {
    navigate("/admin/students/create");
  };

  const getProgramName = (programId: string) => {
    const program = programs.find((p) => p.id === programId);
    return program ? program.name : "Unknown Program";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Students</h1>
        <button
          onClick={() => navigate("/admin/students/create")}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Student
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md">
        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
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

        {/* Students Table */}
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
                  <td className="px-6 py-4 whitespace-wrap">
                    <div className="text-sm font-medium text-gray-900">
                      {student.studentId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-wrap">
                    <div className="text-sm text-gray-900">
                      {student.firstName} {student.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-wrap">
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-wrap">
                    <div className="text-sm text-gray-500">
                      {getProgramName(student.programId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-wrap">
                    <div className="text-sm text-gray-500">Level {student.level}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-wrap">
                    <div className="text-sm text-gray-500">{student.semester}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => navigate(`/admin/students/${student.id}/edit`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
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
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Students Found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search"
                : "Get started by adding a new student"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddStudent}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <FiPlus className="mr-2" /> Add Student
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList; 