import React from "react";
import HeaderBar from "../../components/HeaderBar";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  showAddHeadbarButton: boolean;
  buttonTitle: string;
}

function DashboardLayout({
  children,
  title,
  showAddHeadbarButton,
  buttonTitle,
}: DashboardLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <HeaderBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;