import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

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
          fixed bg-white border-r-2 border-gray-200 h-screen overflow-hidden
          z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${className || "w-72"} 
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
                <MenuItem
                  key={index}
                  to={link.url}
                  icon={link.icon}
                  label={link.title}
                />
              ))}
            </nav>

            {/* Logout Button */}
            <div className="pt-0 border-slate-200 border-t-2">
              <MenuItem
                to="/"
                icon={<RiLogoutCircleLine className="text-xl" />}
                label="Logout"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
