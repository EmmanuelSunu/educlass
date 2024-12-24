// pages/Students.tsx
import DashboardLayout from "../layout";

function Students() {
  const handleAddHeadbarButton = () => {
    // Handle adding exam logic here
    console.log("Add exam clicked");
  };

  return (
    <DashboardLayout
      title="Students"
      showAddHeadbarButton={false}
      onAddHeadbarButton={handleAddHeadbarButton}
      buttonTitle="Add Students"
    >
      {/* Your exams page content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
      </div>
    </DashboardLayout>
  );
}

export default Students;
