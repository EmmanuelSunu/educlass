import React, { useState } from "react";
import Logo from "../../assets/images/logo.svg";
import MenuItem from "../../components/menu-itens";
import {
  RiDashboardLine,
  RiBookOpenLine,
  RiCalendarLine,
  RiMedalLine,
  RiSettings4Line,
  RiLogoutCircleLine,
  RiMenuLine,
  RiCloseLine,
  RiFileListLine,
} from "react-icons/ri";
import URLS from "./url";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: <RiDashboardLine className="text-xl" />,
      url: URLS.DASHBOARD,
    },
    {
      title: "Exams",
      icon: <RiMedalLine className="text-xl" />,
      url: URLS.EXAMS,
    },
    {
      title: "Schedule",
      icon: <RiCalendarLine className="text-xl" />,
      url: URLS.SCHEDULE,
    },
    {
      title: "Classes",
      icon: <RiFileListLine className="text-xl" />,
      url: URLS.CLASSES,
    },
    {
      title: "Results",
      icon: <RiBookOpenLine className="text-xl" />,
      url: URLS.RESULTS,
    },
    {
      title: "Settings",
      icon: <RiSettings4Line className="text-xl" />,
      url: URLS.SETTINGS,
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white md:hidden hover:bg-slate-100"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <RiCloseLine className="w-6 h-6 text-slate-600" />
        ) : (
          <RiMenuLine className="w-6 h-6 text-slate-600" />
        )}
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden transition-opacity duration-300"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 w-64 bg-white border-r border-gray-200 h-screen overflow-hidden
          z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${className || ""} 
        `}
      >
        <div className="p-4 flex flex-col h-screen overflow-y-auto">
          {/* Logo */}
          <div className="pb-4 w-full">
            <img src={Logo} alt="Logo" className="w-28" />
          </div>

          {/* Menu Items */}
          <div className="flex flex-col h-screen justify-between">
            <nav className="flex flex-col mt-4 space-y-1">
              {sidebarLinks.map((link, index) => (
                <div
                  key={index}
                  className="animate-slideInLeft"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <MenuItem
                    to={link.url}
                    icon={link.icon}
                    label={link.title}
                    className="sidebar-item"
                  />
                </div>
              ))}
            </nav>

            {/* Logout Button */}
            <div
              className="pt-0 border-slate-200 border-t-2 animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <MenuItem
                to="/"
                icon={<RiLogoutCircleLine className="text-xl" />}
                label="Logout"
                className="sidebar-item"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  RiDashboardLine, 
  RiMedalLine, 
  RiCalendarLine,
  RiFileListLine,
  RiBookOpenLine,
  RiSettings4Line,
  RiMenuLine,
  RiCloseLine,
  RiLogoutCircleLine
} from "react-icons/ri";
import URLS from "./url";
import Logo from "../../assets/images/logo.svg";

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ to, icon, label, className }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex items-center space-x-3 p-3 rounded-lg transition-colors
        ${isActive ? "bg-primary text-white" : "text-slate-700 hover:bg-slate-100"}
        ${className || ""}
      `}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: <RiDashboardLine className="text-xl" />,
      url: URLS.DASHBOARD,
    },
    {
      title: "Exams",
      icon: <RiMedalLine className="text-xl" />,
      url: URLS.EXAMS,
    },
    {
      title: "Schedule",
      icon: <RiCalendarLine className="text-xl" />,
      url: URLS.SCHEDULE,
    },
    {
      title: "Classes",
      icon: <RiFileListLine className="text-xl" />,
      url: URLS.CLASSES,
    },
    {
      title: "Results",
      icon: <RiBookOpenLine className="text-xl" />,
      url: URLS.RESULTS,
    },
    {
      title: "Settings",
      icon: <RiSettings4Line className="text-xl" />,
      url: URLS.SETTINGS,
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white md:hidden hover:bg-slate-100"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <RiCloseLine className="w-6 h-6 text-slate-600" />
        ) : (
          <RiMenuLine className="w-6 h-6 text-slate-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden transition-opacity duration-300"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static w-64 bg-white border-r border-slate-200 h-screen 
          z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${className || ""}
        `}
      >
        <div className="p-4 flex flex-col h-screen overflow-y-auto">
          <div className="pb-4 w-full">
            <img src={Logo} alt="EduClass Logo" className="w-28" />
            <p className="text-sm text-slate-500 mt-1">Student Portal</p>
          </div>
          <div className="flex flex-col h-full justify-between">
            <nav className="flex flex-col mt-4 space-y-1">
              {sidebarLinks.map((link, index) => (
                <div
                  key={link.url}
                  className="animate-slideInLeft"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <MenuItem
                    to={link.url}
                    icon={link.icon}
                    label={link.title}
                    className="sidebar-item"
                  />
                </div>
              ))}
            </nav>
            
            {/* Logout Button */}
            <div
              className="pt-2 border-slate-200 border-t mt-auto animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <MenuItem
                to="/"
                icon={<RiLogoutCircleLine className="text-xl" />}
                label="Logout"
                className="sidebar-item"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
