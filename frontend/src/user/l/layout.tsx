import React from "react";
import SideBar from "./Sidebar";
import HeaderBar from "./headerbar";
import Breadcrumb from "../../components/Breadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  buttonTitle:string;
  showAddHeadbarButton?: boolean;
  onAddHeadbarButton?: () => void;
}

function DashboardLayout({ 
  children, 
  title,
  buttonTitle,
  showAddHeadbarButton = false,
  onAddHeadbarButton 
}: DashboardLayoutProps) {
  return (
    <div className="lg:flex lg:flex-row">
      <SideBar />
      <div className="flex-1 h-screen bg-slate-100 flex flex-col">
        <HeaderBar 
          title={title}
          showAddHeadbarButton={showAddHeadbarButton}
          onAddHeadbarButton={onAddHeadbarButton}
          buttonTitle={buttonTitle}
        />
        <Breadcrumb title={title} />
        <main className="flex-1 p-6 overflow-auto pb-12 lg:pb-0"> {/* Added pb-12 for mobile, removed on lg screens */}
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;