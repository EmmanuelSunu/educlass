import React, { useState } from "react";
import Logo from "../../assets/images/logo.svg";
import MenuItem from "../../components/menu-itens";
import URLS from "./url";
import {
  RiDashboardHorizontalLine,
  RiArticleLine,
  RiGraduationCapLine,
  RiCalendarEventLine,
  RiMedalLine,
  RiMenuLine,
  RiCloseLine,
  RiLogoutCircleRLine,
  RiSettings3Line,
} from "react-icons/ri";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden hover:bg-slate-100"
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
          fixed md:static w-72 bg-white border-r-2 border-gray-200 h-screen 
          z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${className || ""}
        `}
      >
        <div className="p-4 flex flex-col h-screen overflow-y-auto">
          <div className="pb-4 w-full">
            <img src={Logo} alt="Logo" className="w-28" />
          </div>
          <div className="flex flex-col h-screen justify-between">
            <nav className="flex flex-col mt-4 space-y-1">
              <MenuItem
                to={URLS.DASHBOARD}
                icon={<RiDashboardHorizontalLine />}
                label="Dashboard"
              />
              <MenuItem
                to={URLS.SCHEDULE}
                icon={<RiCalendarEventLine />}
                label="Schedules"
              />
              <MenuItem to="/user/l/exams" icon={<RiArticleLine />} label="Exams" />
              <MenuItem
                to={URLS.CLASS}
                icon={<RiGraduationCapLine />}
                label="Class"
              />
              <MenuItem
                to={URLS.GRADING}
                icon={<RiMedalLine />}
                label="Grading"
              />
              <MenuItem
                to={URLS.SETTINGS}
                icon={<RiSettings3Line />}
                label="Settings"
              />
            </nav>
            <div className="pt-0 border-slate-200 border-t-2">
            <MenuItem to="/" icon={<RiLogoutCircleRLine />} label="Logout" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
