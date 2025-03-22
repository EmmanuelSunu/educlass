import React from "react";
import Sidebar from "../Sidebar";
import Breadcrumb from "../../../components/Breadcrumb";
import ButtonProps from "../../../components/ButtonProps";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  showAddHeadbarButton?: boolean;
  buttonTitle?: string;
}

function DashboardLayout({ 
  children, 
  title,
  showAddHeadbarButton = false,
  buttonTitle = ""
}: DashboardLayoutProps) {
  return (
    <div className="lg:flex lg:flex-row">
      <Sidebar />
      <div className="flex-1 h-screen bg-slate-100 flex flex-col">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
            {showAddHeadbarButton && (
              <button className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors">
                {buttonTitle}
              </button>
            )}
          </div>
        </div>
        <Breadcrumb />
        <main className="flex-1 p-6 overflow-auto pb-12 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
