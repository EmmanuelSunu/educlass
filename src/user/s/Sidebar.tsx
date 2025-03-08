
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiDashboardLine, RiCalendarLine, RiFileList3Line, RiSettings4Line } from 'react-icons/ri';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/user/s/dashboard', icon: <RiDashboardLine />, label: 'Dashboard' },
    { path: '/user/s/schedules', icon: <RiCalendarLine />, label: 'Schedule' },
    { path: '/user/s/exams', icon: <RiFileList3Line />, label: 'Exams' },
    { path: '/user/s/settings', icon: <RiSettings4Line />, label: 'Settings' },
  ];

  return (
    <aside className={`bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen fixed top-0 left-0 z-30 w-64 transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
        <Link to="/user/s/dashboard" className="text-xl font-bold text-primary">
          EduClass
        </Link>
      </div>
      <nav className="mt-6 px-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
