
import React from "react";
import DashboardLayout from "../../layout/index";
import { FiCalendar, FiUsers } from "react-icons/fi";
import examsData from "../../../user/l/exams/data/exams.json";

// Mock data for student classes
const studentClassIds = [1, 2, 3]; // Classes the student is enrolled in

function StudentClasses() {
  // Get unique classes from exams data
  const classes = [...new Set(
    examsData
      .filter(exam => studentClassIds.includes(exam.classId))
      .map(exam => ({
        id: exam.classId,
        name: exam.className
      }))
  )];

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Classes</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classItem: any) => (
            <div key={classItem.id} className="bg-white rounded-lg shadow p-6 transition-all hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  <FiUsers size={20} />
                </div>
                <h3 className="text-lg font-semibold">{classItem.name}</h3>
              </div>
              
              <div className="flex items-center text-sm text-slate-500 mb-4">
                <FiCalendar className="mr-2" />
                <span>Spring 2025</span>
              </div>
              
              <div className="mt-4">
                <button className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">
                  View Class Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentClasses;
