
import React from "react";
import Sidebar from "../Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  showAddHeadbarButton?: boolean;
  buttonTitle?: string;
  onAddButtonClick?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  showAddHeadbarButton = false,
  buttonTitle = "Add New",
  onAddButtonClick,
}) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col md:ml-72">
        <header className="bg-white shadow-sm border-b border-slate-200 h-16 flex items-center px-4 md:px-6">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-semibold text-slate-800 md:ml-0 ml-8">{title}</h1>
            {showAddHeadbarButton && (
              <button
                onClick={onAddButtonClick}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {buttonTitle}
              </button>
            )}
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
