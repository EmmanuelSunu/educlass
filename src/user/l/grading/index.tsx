// pages/Grading.tsx
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout";

function Grading() {
  const navigate = useNavigate();
  
  const handleAddHeadbarButton = () => {
    navigate('/user/l/exams/create');
  };

  return (
    <DashboardLayout
      title="Grading"
      showAddHeadbarButton={true}
      onAddHeadbarButton={handleAddHeadbarButton}
      buttonTitle="Add Grading"
    >
      {/* Your exams page content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
      </div>
    </DashboardLayout>
  );
}

export default Grading;
