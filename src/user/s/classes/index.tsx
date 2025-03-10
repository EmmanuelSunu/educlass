import { useState } from "react"; // Corrected import
import DashboardLayout from "../layout";
import {
  FiCalendar,
  FiUsers,
  FiUser,
  FiBookOpen,
  FiClock,
} from "react-icons/fi";
import examsData from "../../l/exams/data/exams.json";
import { Dialog } from "@headlessui/react";

// Mock data for student classes
const studentClassIds = [1, 2, 3, 5]; // Classes the student is enrolled in

// Mock additional class details
const classDetails = {
  1: {
    duration: "16 weeks",
    level: "200",
    semester: "First Semester",
    lecturer: "Dr. James Smith",
    description:
      "An introduction to programming concepts, algorithms, and problem-solving techniques.",
  },
  2: {
    duration: "14 weeks",
    level: "300",
    semester: "Second Semester",
    lecturer: "Prof. Sarah Johnson",
    description:
      "Advanced web development techniques using modern frameworks and tools.",
  },
  3: {
    duration: "12 weeks",
    level: "400",
    semester: "First Semester",
    lecturer: "Dr. Michael Chen",
    description:
      "Comprehensive study of data structures and their applications in software engineering.",
  },
  5: {
    duration: "16 weeks",
    level: "300",
    semester: "First Semester",
    lecturer: "Dr. Emily Wilson",
    description:
      "Introduction to machine learning algorithms and implementation techniques.",
  },
};

function StudentClasses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);

  // Get unique classes from exams data
  const classes = [
    ...new Set(
      examsData
        .filter((exam) => studentClassIds.includes(exam.classId))
        .map((exam) => ({
          id: exam.classId,
          name: exam.className,
        })),
    ),
  ];

  const handleViewClassDetails = (classItem: any) => {
    setSelectedClass({
      ...classItem,
      ...classDetails[classItem.id as keyof typeof classDetails],
    });
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout title="My Classes" buttonTitle="Close">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Classes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 card-grid">
          {classes.map((classItem: any) => (
            <div
              key={classItem.id}
              className="bg-white rounded-lg shadow p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  <FiUsers size={20} />
                </div>
                <h3 className="text-lg font-semibold">{classItem.name}</h3>
              </div>

              <div className="flex items-center text-sm text-slate-500 mb-4">
                <FiCalendar className="mr-2" />
                <span>
                  Level{" "}
                  {classDetails[classItem.id as keyof typeof classDetails]
                    ?.level || "N/A"}
                </span>
              </div>

              <div className="mt-4">
                <button
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                  onClick={() => handleViewClassDetails(classItem)}
                >
                  View Class Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Class Details Modal */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="relative z-50"
        >
          {/* Modal backdrop */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Modal container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
                {selectedClass?.name}
              </Dialog.Title>

              <div className="space-y-4">
                <div className="flex items-center">
                  <FiBookOpen className="text-primary mr-3" />
                  <span className="font-semibold mr-2">Level:</span>
                  <span>{selectedClass?.level}</span>
                </div>

                <div className="flex items-center">
                  <FiCalendar className="text-primary mr-3" />
                  <span className="font-semibold mr-2">Semester:</span>
                  <span>{selectedClass?.semester}</span>
                </div>

                <div className="flex items-center">
                  <FiClock className="text-primary mr-3" />
                  <span className="font-semibold mr-2">Duration:</span>
                  <span>{selectedClass?.duration}</span>
                </div>

                <div className="flex items-center">
                  <FiUser className="text-primary mr-3" />
                  <span className="font-semibold mr-2">Lecturer:</span>
                  <span>{selectedClass?.lecturer}</span>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description:</h4>
                  <p className="text-gray-600">{selectedClass?.description}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
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

export default StudentClasses;
