import React from "react";
import SideBar from "./l/Sidebar";
import Breadcrumb from "../components/Breadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="lg:flex lg:flex-row">
      <SideBar />
      <div className="flex-1 h-screen bg-slate-100 flex flex-col">
        <Breadcrumb />
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
