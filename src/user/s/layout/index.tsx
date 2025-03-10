import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../../components/Breadcrumb";
import ButtonProps from "../../../components/ButtonProps";
import Sidebar from "../Sidebar";

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
  showAddHeadbarButton?: boolean;
  onAddHeadbarButton?: () => void;
  buttonTitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  children,
  showAddHeadbarButton = false,
  onAddHeadbarButton,
  buttonTitle = "Add New",
}) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 md:ml-72 transition-all duration-300">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          </div>
          <div className="flex items-center">
            {/* Removed Student text */}
          </div>
        </header>
        <div className="pt-4 px-8">
          <Breadcrumb />
          <div className="flex items-center justify-between mb-6 mt-4">
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            {showAddHeadbarButton && (
              <ButtonProps onClick={onAddHeadbarButton}>
                {buttonTitle}
              </ButtonProps>
            )}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;