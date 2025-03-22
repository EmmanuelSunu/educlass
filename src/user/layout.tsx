import React from 'react';
import Breadcrumb from "../components/Breadcrumb";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showAddHeadbarButton?: boolean;
  buttonTitle?: string;
  onAddHeadbarButton?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  showAddHeadbarButton = false,
  buttonTitle = "",
  onAddHeadbarButton,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb
        title={title}
        showAddButton={showAddHeadbarButton}
        buttonTitle={buttonTitle}
        onAddButton={onAddHeadbarButton}
      />
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout; 