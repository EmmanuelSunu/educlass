import React, { ReactNode } from "react";
import SideBar from "../Sidebar";
import Breadcrumb from "../../../components/Breadcrumb";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  showAddHeadbarButton?: boolean;
  buttonTitle?: string;
  onButtonClick?: () => void;
}

function DashboardLayout({
  children,
  title,
  showAddHeadbarButton = false,
  buttonTitle = "Add New",
  onButtonClick,
}: DashboardLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <SideBar />
      <div className="flex-1 lg:ml-64">
        <header className="bg-white shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <Breadcrumb />
              <h1 className="text-2xl font-bold text-slate-800 mt-2">{title}</h1>
            </div>
            {showAddHeadbarButton && (
              <button
                onClick={onButtonClick}
                className="mt-4 sm:mt-0 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                {buttonTitle}
              </button>
            )}
          </div>
        </header>
        <main className="px-4 sm:px-6 pb-8">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;