import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineDashboard, MdSchool } from 'react-icons/md';
import { BsGear } from 'react-icons/bs';
import { MdOutlineAssignment } from 'react-icons/md';
import Logo from '../../assets/logo.png';

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 w-72 bg-white border-r border-slate-200 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto`}
    >
      <div className="p-6">
        <div className="flex items-center mb-8">
          <img src={Logo} alt="Logo" className="h-8 w-auto mr-2" />
          <span className="text-xl font-bold text-slate-800">EduClass</span>
        </div>

        <nav className="space-y-1">
          <Link
            to="/user/l/dashboard"
            className={`flex items-center px-4 py-3 text-slate-600 rounded-lg transition-colors ${
              isActive("/dashboard")
                ? "bg-blue-50 text-primary font-medium"
                : "hover:bg-slate-100"
            }`}
          >
            <MdOutlineDashboard className="text-xl mr-3" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/user/l/exams"
            className={`flex items-center px-4 py-3 text-slate-600 rounded-lg transition-colors ${
              isActive("/exams")
                ? "bg-blue-50 text-primary font-medium"
                : "hover:bg-slate-100"
            }`}
          >
            <MdOutlineAssignment className="text-xl mr-3" />
            <span>Exams</span>
          </Link>

          <Link
            to="/user/l/class"
            className={`flex items-center px-4 py-3 text-slate-600 rounded-lg transition-colors ${
              isActive("/class")
                ? "bg-blue-50 text-primary font-medium"
                : "hover:bg-slate-100"
            }`}
          >
            <MdSchool className="text-xl mr-3" />
            <span>Classes</span>
          </Link>

          <Link
            to="/user/l/settings"
            className={`flex items-center px-4 py-3 text-slate-600 rounded-lg transition-colors ${
              isActive("/settings")
                ? "bg-blue-50 text-primary font-medium"
                : "hover:bg-slate-100"
            }`}
          >
            <BsGear className="text-xl mr-3" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;