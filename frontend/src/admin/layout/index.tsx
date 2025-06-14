import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  showAddButton?: boolean;
  buttonTitle?: string;
  onAddButton?: () => void;
}

function AdminLayout({
  children,
  title,
  showAddButton = false,
  buttonTitle = "",
  onAddButton,
}: AdminLayoutProps) {
  return (
    <div className="lg:flex lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 h-screen bg-slate-100 flex flex-col">
        <AdminHeader 
          title={title}
          showAddButton={showAddButton}
          buttonTitle={buttonTitle}
          onAddButton={onAddButton}
        />
        <main className="flex-1 p-6 overflow-auto pb-12 lg:pb-6`">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout; 