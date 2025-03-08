import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import { FiHome, FiCalendar, FiFileText, FiSettings, FiLogOut } from "react-icons/fi";
import { RiMenu2Line, RiCloseLine } from "react-icons/ri";

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
        className="md:hidden absolute top-4 left-4 z-50 p-2 rounded-md text-slate-500 hover:bg-slate-200 shadow-sm"
      >
        {isOpen ? <RiCloseLine size={24} /> : <RiMenu2Line size={24} />}
      </button>

      <aside
        className={`
          fixed md:static w-72 bg-white border-r-2 border-gray-200 h-screen 
          z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${className || ""}
        `}
      >
        <div className="p-4 flex flex-col h-screen overflow-y-auto">
          <div className="pb-4 w-full">
            <img src={Logo} alt="EduClass Logo" className="w-28" />
          </div>

          <div className="flex flex-col h-screen justify-between">
            <nav className="flex flex-col mt-4 space-y-1">
              <MenuItem to="/user/s/dashboard" icon={<FiHome />} label="Dashboard" />
              <MenuItem to="/user/s/schedules" icon={<FiCalendar />} label="Schedules" />
              <MenuItem to="/user/s/exams" icon={<FiFileText />} label="Exams" />
              <MenuItem to="/user/s/settings" icon={<FiSettings />} label="Settings" />
            </nav>

            <div className="pb-8 pt-4">
              <MenuItem to="/" icon={<FiLogOut />} label="Logout" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

export default Sidebar;