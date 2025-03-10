import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import ExamForm from "../../../../components/ExamForm";
import examsData from "../data/exams.json";
import { ExamDetails } from "../types";

function CreateExam() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);

  useEffect(() => {
    if (id) {
      // We're in edit mode
      const exam = examsData.find((exam) => exam.id === Number(id));

      if (exam) {
        console.log("Editing exam:", exam);
        // Transform the data to match the `ExamDetails` type
        const updatedExam: ExamDetails = {
          ...exam,
          type: exam.type as "exam" | "test" | "assignment", // Ensure type matches
          status: exam.status as "scheduled" | "completed" | "in-progress", // Explicitly cast status
          durationHours: exam.durationHours || 1, // Ensure durationHours is a number
          durationMinutes: exam.durationMinutes || 0, // Ensure durationMinutes is a number
          questions: exam.questions.map((q) => ({
            ...q,
            id: String(q.id), // Ensure id is a string
            type: q.type as "multi-choice" | "essay" | "fill-ins", // Explicitly cast type
          })),
        };


        setExamDetails(updatedExam);
      } else {
        console.log("Exam not found with id:", id);
        navigate("/user/l/exams");
      }
    } else {
      // We're in create mode
      setExamDetails({
        id: Math.max(...examsData.map((exam) => exam.id)) + 1,
        title: "",
        type: "exam", // Ensure `type` is one of the allowed values
        duration: "1 hour",
        durationHours: 1, // Ensure `durationHours` is a number
        durationMinutes: 0, // Ensure `durationMinutes` is a number
        startTime: "10:00",
        endTime: "11:00",
        status: "scheduled",
        dueDate: "",
        description: "",
        questions: [],
        classId: undefined,
        className: "",
      });
    }
  }, [id, navigate]);

  const handleSave = async () => {
    if (!examDetails) return;

    try {
      console.log("Saving exam:", examDetails);
      alert("Exam saved successfully!");
      navigate("/user/l/exams");
    } catch (error) {
      console.error("Error saving exam:", error);
      alert("Failed to save exam. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/user/l/exams");
  };

  if (!examDetails) {
    return (
      <DashboardLayout title="Loading..." showAddHeadbarButton={false} buttonTitle="">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-600">Loading exam details...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={id ? "Edit Exam" : "Create Exam"}
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <ExamForm
        examDetails={examDetails}
        onExamChange={(updatedExam) => setExamDetails(updatedExam)} // Ensure type compatibility
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </DashboardLayout>
  );
}

export default CreateExam;