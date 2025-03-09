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
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-0 ">
        <HeaderBar
          title={title}
          showAddHeadbarButton={showAddHeadbarButton}
          onAddHeadbarButton={onAddHeadbarButton}
          buttonTitle={buttonTitle}
        />
        <Breadcrumb />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

import React from "react";
import SideBar from "./Sidebar";
import Breadcrumb from "../../components/Breadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="lg:flex lg:flex-row">
      <SideBar />
      <div className="flex-1 h-screen bg-slate-100 flex flex-col">
        <Breadcrumb />
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;