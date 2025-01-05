// pages/Dashboard.tsx
import DashboardLayout from "../layout";
import ExamCard from "../../../components/examCard";

function Dashboard() {
  const handleAddHeadbarButton = () => {
    // Handle adding exam logic here
    console.log("Add exam clicked");
  };

  const exams = [
    { id: 1, title: "Operating Systems", code: "SOT81932" },
    { id: 2, title: "Database Management", code: "DBM72831" },
    { id: 3, title: "Web Technologies", code: "WEB92847" },
    { id: 4, title: "Human Interactions", code: "WEB99047" },
    { id: 4, title: "Ethical & Legal Issues In Computing", code: "WEB99047" },
  ];

  const handleViewExam = (examId: number) => {
    console.log(`Viewing exam ${examId}`);
    // Add your view logic here
  };

  return (
    <DashboardLayout
      title="Dashboard"
      showAddHeadbarButton={true}
      onAddHeadbarButton={handleAddHeadbarButton}
      buttonTitle="Add Exams"
    >
      {/* Your exams page content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            title={exam.title}
            onView={() => handleViewExam(exam.id)}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
