// pages/class/index.tsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout";
import ClassCard from "../../../components/classCard";
import classData from "./data/class.json";

interface Class {
  id: string;
  level: string;
  program: string;
  students: { id: string; name: string }[];
}

function ClassIndex() {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    // Fetch class data from local JSON file
    const fetchClasses = async () => {
      setClasses(classData as Class[]);
    };

    fetchClasses();
  }, []);

  const handleAddClass = () => {
    console.log("Add class clicked");
    // Add logic to add a new class
  };

  return (
    <DashboardLayout
      title="Classes"
      showAddHeadbarButton={true}
      onAddHeadbarButton={handleAddClass}
      buttonTitle="Add Class"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((classItem) => (
          <ClassCard
            key={classItem.id}
            classId={classItem.id}
            level={classItem.level}
            program={classItem.program}
            totalStudents={classItem.students.length}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}

export default ClassIndex;
