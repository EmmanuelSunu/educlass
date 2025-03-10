
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../s/layout";
import { FiCalendar, FiUsers, FiUser, FiBookOpen, FiClock } from "react-icons/fi";
import examsData from "../../l/exams/data/exams.json";
import classData from "../../l/class/data/class.json";
import { Dialog } from "@headlessui/react";
import URLS from "../url";

// Mock data for student classes
const studentClassIds = [1, 2, 3, 5]; // Classes the student is enrolled in

// Student enrolled class IDs

function StudentClasses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  
  // Get classes the student is enrolled in
  const classes = classData
    .filter(cls => studentClassIds.includes(cls.id))
    .map(cls => ({
      id: cls.id,
      name: cls.name
    }));

  const handleViewClassDetails = (classItem: any) => {
    const classDetail = classData.find(cls => cls.id === classItem.id);
    if (classDetail) {
      setSelectedClass(classDetail);
      setIsModalOpen(true);
    }
  };

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
                <span>Level {classData.find(cls => cls.id === classItem.id)?.level || "N/A"}</span>
              </div>
              
              <div className="mt-4 space-y-2">
                <button 
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                  onClick={() => handleViewClassDetails(classItem)}
                >
                  Quick View
                </button>
                <Link 
                  to={URLS.CLASS_DETAILS(classItem.id.toString())}
                  className="block w-full text-center px-4 py-2 bg-white border border-primary text-primary rounded-md hover:bg-primary/5 transition"
                >
                  View Full Details
                </Link>
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
