import React from "react";
import Breadcrumb from "../../components/Breadcrumb";

interface AdminHeaderProps {
  title: string;
  showAddButton?: boolean;
  onAddButton?: () => void;
  buttonTitle?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  showAddButton = false,
  onAddButton,
  buttonTitle = "Add New"
}) => {
  return (
    <>
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        </div>
        {showAddButton && (
          <button
            onClick={onAddButton}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {buttonTitle}
          </button>
        )}
      </header>
      <Breadcrumb title={title} />
    </>
  );
};

export default AdminHeader; 