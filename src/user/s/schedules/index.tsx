
import React from "react";
import DashboardLayout from "../layout";

function StudentSchedule() {
  return (
    <DashboardLayout
      title="My Schedule"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">My Class Schedule</h2>
        <p className="text-slate-600">Your class schedule and upcoming events will appear here.</p>
      </div>
    </DashboardLayout>
  );
}

export default StudentSchedule;
