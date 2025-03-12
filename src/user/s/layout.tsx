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
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - will be responsive through its own implementation */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Headbar
          title={title}
          showAddButton={showAddHeadbarButton}
          buttonTitle={buttonTitle}
          onAddButton={onAddHeadbarButton}
        />
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
