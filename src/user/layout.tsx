import React from "react";
import SideBar from "../components/SideBar.tsx";
function DashboardLayout() {
  return (
    <>
      <div className="hidden lg:flex">
      <SideBar />
      <div className="flex h-screen bg-slate-200"></div>
      </div>
    </>
  );
}
export default DashboardLayout;
