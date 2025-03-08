
import React from "react";
import DashboardLayout from "../layout";

function StudentSettings() {
  return (
    <DashboardLayout
      title="Settings"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Account Settings</h2>
        <p className="text-slate-600">Manage your profile and preferences here.</p>
      </div>
    </DashboardLayout>
  );
}

export default StudentSettings;
