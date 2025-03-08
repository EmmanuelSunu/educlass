
import React, { ReactNode, useState } from "react";
import Sidebar from "../Sidebar";
import MobileNavBar from "../../../components/MobileNavBar";
import HeaderBar from "../../../components/HeaderBar";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  showAddHeadbarButton?: boolean;
  buttonTitle?: string;
  onAddHeadbarButton?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  showAddHeadbarButton = false,
  buttonTitle = "Add",
  onAddHeadbarButton,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Mobile Navigation */}
      <MobileNavBar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-72 pt-14 md:pt-0">
        <div className="hidden md:block">
          <HeaderBar 
            title={title}
            buttonTitle={buttonTitle}
            showAddHeadbarButton={showAddHeadbarButton}
            onAddHeadbarButton={onAddHeadbarButton}
          />
        </div>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const LecturerLayout = ({ children }: { children: ReactNode }) => (
  <DashboardLayout 
    title="Lecturer Dashboard" 
    showAddHeadbarButton={true}
    buttonTitle="Add"
  >
    {children}
  </DashboardLayout>
);

const StudentLayout = ({ children }: { children: ReactNode }) => (
  <DashboardLayout 
    title="Student Dashboard" 
    showAddHeadbarButton={false}
    buttonTitle=""
  >
    {children}
  </DashboardLayout>
);

export { DashboardLayout, LecturerLayout, StudentLayout, HeaderBar };
export default DashboardLayout;
