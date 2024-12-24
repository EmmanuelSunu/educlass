// pages/Schedule.tsx
import DashboardLayout from "../layout";

function Schedule() {
  const handleAddHeadbarButton = () => {
    // Handle adding exam logic here
    console.log("Add exam clicked");
  };

  return (
    <DashboardLayout
      title="Schedule"
      showAddHeadbarButton={true}
      onAddHeadbarButton={handleAddHeadbarButton}
      buttonTitle="Add Schedule"
    >
      {/* Your exams page content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
      </div>
    </DashboardLayout>
  );
}

export default Schedule;
