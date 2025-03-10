import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../../components/Breadcrumb";
import ButtonProps from "../../../components/ButtonProps";
import Sidebar from "../Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  showAddHeadbarButton?: boolean;
  addButtonClick?: () => void;
  buttonTitle?: string;
  buttonIcon?: JSX.Element;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  showAddHeadbarButton = true,
  addButtonClick,
  buttonTitle = "Add New",
  buttonIcon,
}: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 transition-all duration-300">
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
              <ButtonProps onClick={addButtonClick}>
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