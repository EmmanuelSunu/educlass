import React from "react";
import Sidebar from "./Sidebar";
import Headbar from "../../components/HeaderBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showAddHeadbarButton?: boolean;
  buttonTitle?: string;
  onAddHeadbarButton?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title = "Dashboard",
  showAddHeadbarButton = false,
  buttonTitle = "Add New",
  onAddHeadbarButton,
}) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Sidebar - will be responsive through its own implementation */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full h-screen">
        <div className="sticky top-0 z-10">
          <Headbar
            title={title}
            showAddButton={showAddHeadbarButton}
            buttonTitle={buttonTitle}
            onAddHeadbarButton={onAddHeadbarButton}
          />
        </div>
        <main className="flex-grow p-6 overflow-y-auto h-[calc(100vh-64px)] dashboard-content pb-8 md:pb-0">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;