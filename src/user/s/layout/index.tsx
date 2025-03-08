import React, { ReactNode } from "react";
import Sidebar from "../Sidebar";
import HeaderBar from "../headerbar";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  buttonTitle?: string;
  showAddHeadbarButton?: boolean;
  onAddHeadbarButton?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  buttonTitle = "",
  showAddHeadbarButton = false,
  onAddHeadbarButton,
}) => {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderBar 
          title={title}
          buttonTitle={buttonTitle}
          showAddHeadbarButton={showAddHeadbarButton}
          onAddHeadbarButton={onAddHeadbarButton}
        />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;