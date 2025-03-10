
import React, { useEffect, useState } from 'react';
import examsData from '../../l/exams/data/exams.json';

interface Exam {
  id: number;
  title: string;
  type: string;
  duration: string;
  durationHours: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  status: string;
  dueDate: string;
  description: string;
  classId: number;
  className: string;
  questions: Array<any>;
}

// Student class IDs - replace with actual student enrollment data
const studentClassIds = [1, 2, 3]; // Assuming these are the classes the student is enrolled in

const ExamDebugger: React.FC = () => {
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [targetExam, setTargetExam] = useState<Exam | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  
  useEffect(() => {
    // Type assertion for exams data
    const typedExamsData = examsData as Exam[];
    setAvailableExams(typedExamsData);
    
    // Look specifically for exam with ID 105
    const exam105 = typedExamsData.find(exam => exam.id === 105);
    setTargetExam(exam105 || null);
    
    // Check student enrollment for this exam
    const isEnrolled = exam105 ? studentClassIds.includes(exam105.classId) : false;
    
    // Debug information
    setDebugInfo({
      totalExams: typedExamsData.length,
      examIds: typedExamsData.map(e => e.id),
      hasExam105: !!exam105,
      studentClassIds,
      isEnrolledIfExists: isEnrolled,
    });
  }, []);
  
  return (
    <div className="p-4 border border-gray-300 rounded-lg mb-4 bg-gray-50">
      <h2 className="text-lg font-medium mb-2">Exam Availability Debug Info</h2>
      
      <div className="mb-2">
        <strong>Looking for Exam ID:</strong> 105
      </div>
      
      <div className="mb-2">
        <strong>Exam Found:</strong> {targetExam ? 'Yes' : 'No'}
      </div>
      
      {targetExam && (
        <div className="mb-4">
          <h3 className="text-md font-medium">Exam Details:</h3>
          <div><strong>Title:</strong> {targetExam.title}</div>
          <div><strong>Class ID:</strong> {targetExam.classId}</div>
          <div><strong>Due Date:</strong> {targetExam.dueDate}</div>
          <div><strong>Status:</strong> {targetExam.status}</div>
        </div>
      )}
      
      <div className="mb-2">
        <strong>Debug Information:</strong>
        <pre className="bg-gray-100 p-2 rounded text-xs mt-1 max-h-40 overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
      
      <div className="text-sm text-gray-500 mt-2">
        Note: This component is for debugging only and should be removed in production.
      </div>
    </div>
  );
};

export default ExamDebugger;
