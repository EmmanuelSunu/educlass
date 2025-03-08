
import React from "react";
import SideBar from "./Sidebar";
import Breadcrumb from "../../components/Breadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  showAddHeadbarButton?: boolean;
  onAddHeadbarButton?: () => void;
  buttonTitle?: string;
}

function DashboardLayout({
  children,
  title,
  showAddHeadbarButton = false,
  onAddHeadbarButton,
  buttonTitle,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-100">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
          {showAddHeadbarButton && (
            <button
              onClick={onAddHeadbarButton}
              className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {buttonTitle}
            </button>
          )}
        </header>
        <Breadcrumb />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
