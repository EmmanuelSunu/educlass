import React from "react";
import Sidebar from "../Sidebar";
import Breadcrumb from "../../../components/Breadcrumb";
import ButtonProps from "../../../components/ButtonProps";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  showAddHeadbarButton?: boolean;
  onAddHeadbarButton?: () => void;
  buttonTitle?: string;
  buttonIcon?: JSX.Element;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  showAddHeadbarButton = false,
  onAddHeadbarButton,
  buttonTitle = "Add New",
}: DashboardLayoutProps) => {
  return (
    <div className="lg:flex lg:flex-row">
      <Sidebar />
      <div className="flex-1 h-screen bg-slate-100 flex flex-col">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          </div>
          {showAddHeadbarButton && (
            <ButtonProps onClick={onAddHeadbarButton}>{buttonTitle}</ButtonProps>
          )}
        </header>
        <Breadcrumb title={title} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 