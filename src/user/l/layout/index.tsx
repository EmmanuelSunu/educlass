import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import Sidebar from "../Sidebar";
import HeaderBar from "../headerbar"; 
import MobileNavBar from "../../../components/MobileNavBar";

// Original HeaderBar component remains unchanged
const HeaderBarComp = styled.header`
  background-color: #f0f0f0; /* Example light background */
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const HeaderButton = styled.button`
  background-color: #4CAF50; /* Example green button */
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;


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
          <HeaderBarComp>
            <HeaderTitle>{title}</HeaderTitle>
            {showAddHeadbarButton && (
              <HeaderButton onClick={onAddHeadbarButton}>{buttonTitle}</HeaderButton>
            )}
          </HeaderBarComp>
        </div>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Example usage in Lecturer and Student layouts
const LecturerLayout = ({ children }: { children: ReactNode }) => (
  <DashboardLayout title="Lecturer Dashboard" showAddHeadbarButton buttonTitle="Add">
    {children}
  </DashboardLayout>
);

const StudentLayout = ({ children }: { children: ReactNode }) => (
  <DashboardLayout title="Student Dashboard">
    {children}
  </DashboardLayout>
);


export { DashboardLayout, LecturerLayout, StudentLayout, HeaderBarComp as HeaderBar };