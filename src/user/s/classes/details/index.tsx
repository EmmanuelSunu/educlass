
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layout";
import { useParams, Link } from "react-router-dom";
import classData from "../../../l/class/data/class.json";
import examsData from "../../../l/exams/data/exams.json";
import { FiArrowLeft, FiCalendar, FiUser, FiClock, FiBookOpen, FiFileText } from "react-icons/fi";
import URLS from "../../url";

const ClassDetails = () => {
  const { id } = useParams<{id: string}>();
  const [classDetail, setClassDetail] = useState<any>(null);
  const [classExams, setClassExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const classId = parseInt(id);
      
      // Find class details
      const foundClass = classData.find(cls => cls.id === classId);
      setClassDetail(foundClass || null);
      
      // Find exams for this class
      const exams = examsData.filter(exam => exam.classId === classId);
      setClassExams(exams);
      
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <p>Loading class details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!classDetail) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Link to={URLS.CLASSES} className="flex items-center text-primary mb-4">
            <FiArrowLeft className="mr-2" /> Back to Classes
          </Link>
          <p className="text-red-500">Class not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <Link to={URLS.CLASSES} className="flex items-center text-primary mb-4">
          <FiArrowLeft className="mr-2" /> Back to Classes
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">{classDetail.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <FiUser className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lecturer</p>
                <p className="font-medium">{classDetail.lecturer}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <FiCalendar className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Level & Semester</p>
                <p className="font-medium">Level {classDetail.level}, {classDetail.semester}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <FiClock className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{classDetail.duration}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{classDetail.description}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Exams & Assignments</h2>
          
          {classExams.length === 0 ? (
            <p className="text-gray-500">No exams or assignments available for this class.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classExams.map((exam) => (
                <div key={exam.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium">{exam.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      exam.status === 'completed' ? 'bg-green-100 text-green-800' :
                      exam.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FiFileText className="mr-2" />
                    <span>{exam.type.charAt(0).toUpperCase() + exam.type.slice(1)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <FiCalendar className="mr-2" />
                    <span>Due: {exam.dueDate}</span>
                  </div>
                  
                  <Link 
                    to={URLS.EXAM_DETAILS(exam.id.toString())} 
                    className="block w-full text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClassDetails;
