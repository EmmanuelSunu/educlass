import React from "react";
import HeaderBar from "./headerbar";
import Sidebar from "./Sidebar";
import Breadcrumb from "../../components/Breadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  showAddHeadbarButton?: boolean;
  onAddHeadbarButton?: () => void;
  buttonTitle: string;
}

function DashboardLayout({
  children,
  title,
  showAddHeadbarButton = true,
  onAddHeadbarButton,
  buttonTitle = "Add New",
}: DashboardLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <HeaderBar
          title={title}
          showAddHeadbarButton={showAddHeadbarButton}
          onAddHeadbarButton={onAddHeadbarButton}
          buttonTitle={buttonTitle}
        />
        <Breadcrumb />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;