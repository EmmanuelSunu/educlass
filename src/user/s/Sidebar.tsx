import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import { FiHome, FiCalendar, FiFileText, FiSettings, FiLogOut, FiMenu, FiX } from "react-icons/fi";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const MenuItem = ({ to, icon, label }) => (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
        isActive(to)
          ? "bg-primary text-white"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-slate-500 hover:bg-slate-200"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <aside
        className={`
          fixed md:static w-64 bg-white border-r border-slate-200 h-screen 
          z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${className || ""}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 px-6 border-b">
            <img src={Logo} alt="EduClass Logo" className="h-8" />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <MenuItem to="/user/s/dashboard" icon={<FiHome />} label="Dashboard" />
              <MenuItem to="/user/s/schedules" icon={<FiCalendar />} label="Schedules" />
              <MenuItem to="/user/s/exams" icon={<FiFileText />} label="Exams" />
              <MenuItem to="/user/s/settings" icon={<FiSettings />} label="Settings" />
            </div>

            <div className="pt-4 mt-4 border-slate-200 border-t">
              <MenuItem to="/" icon={<FiLogOut />} label="Logout" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;