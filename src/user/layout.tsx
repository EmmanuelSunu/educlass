import React from 'react';
import Breadcrumb from "../components/Breadcrumb";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb title={title} />
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout; 