
import React, { ReactNode, useState } from "react";
import Sidebar from "../Sidebar";
import HeaderBar from "../../../components/HeaderBar";
import MobileNavBar from "../../../components/MobileNavBar";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Navigation Bar */}
      <MobileNavBar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block fixed inset-0 z-10 md:relative md:z-0`}>
        <Sidebar />
      </div>

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

export { DashboardLayout, HeaderBar };
export default DashboardLayout;
