// pages/Settings.tsx
import DashboardLayout from "../layout";

function Settings() {
  const handleAddHeadbarButton = () => {
    // Handle adding exam logic here
    console.log("Add exam clicked");
  };

  return (
    <DashboardLayout
      title="Settings"
      showAddHeadbarButton={false}
      onAddHeadbarButton={handleAddHeadbarButton}
      buttonTitle="Add Settings"
    >
      {/* Your exams page content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
      </div>
    </DashboardLayout>
  );
}

export default Settings;
