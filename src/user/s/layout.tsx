
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

export default DashboardLayout;
import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  title?: string;
  showAddHeadbarButton?: boolean;
  buttonTitle?: string;
  onAddButtonClick?: () => void;
}

function DashboardLayout({
  children,
  title = "Dashboard",
  showAddHeadbarButton = false,
  buttonTitle = "Add",
  onAddButtonClick,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-72">
        <header className="bg-white py-4 px-6 shadow-sm flex justify-between items-center">
          <h1 className="text-h4 font-bold text-gray-800">{title}</h1>
          {showAddHeadbarButton && (
            <button
              onClick={onAddButtonClick}
              className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors"
            >
              {buttonTitle}
            </button>
          )}
        </header>
        <main className="px-4 md:px-6 py-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
