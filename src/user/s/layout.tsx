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
  showAddHeadbarButton = false,
  onAddHeadbarButton,
  buttonTitle,
}: DashboardLayoutProps) {
  return (
    <div className="lg:flex lg:flex-row">
      <Sidebar />
      <div className="flex-1 h-screen bg-slate-100 flex flex-col">
        <HeaderBar
          title={title}
          showAddHeadbarButton={showAddHeadbarButton}
          onAddHeadbarButton={onAddHeadbarButton}
          buttonTitle={buttonTitle}
        />
        <Breadcrumb />
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;