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

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  return (
    <>
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

      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden transition-opacity duration-300"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed md:static w-72 bg-white border-r-2 border-gray-200 h-[100dvh] 
          z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${className || ""}
        `}
      >
        <div className="p-4 flex flex-col h-full overflow-y-auto">
          <div className="pb-4 w-full">
            <img src={Logo} alt="Logo" className="w-28" />
            <p className="text-sm text-slate-500 mt-1">Lecturer Portal</p>
          </div>
          <div className="flex flex-col h-full justify-between">
            <nav className="flex flex-col mt-4 space-y-1">
              <div className="animate-slideInLeft" style={{ animationDelay: "0s" }}>
                <MenuItem
                  to={URLS.DASHBOARD}
                  icon={<RiDashboardHorizontalLine />}
                  label="Dashboard"
                />
              </div>
              <div className="animate-slideInLeft" style={{ animationDelay: "0.05s" }}>
                <MenuItem
                  to={URLS.SCHEDULE}
                  icon={<RiCalendarEventLine />}
                  label="Schedules"
                />
              </div>
              <div className="animate-slideInLeft" style={{ animationDelay: "0.1s" }}>
                <MenuItem to="/user/l/exams" icon={<RiArticleLine />} label="Exams" />
              </div>
              <div className="animate-slideInLeft" style={{ animationDelay: "0.15s" }}>
                <MenuItem
                  to={URLS.CLASS}
                  icon={<RiGraduationCapLine />}
                  label="Class"
                />
              </div>
              <div className="animate-slideInLeft" style={{ animationDelay: "0.2s" }}>
                <MenuItem
                  to={URLS.GRADING}
                  icon={<RiMedalLine />}
                  label="Grading"
                />
              </div>
              <div className="animate-slideInLeft" style={{ animationDelay: "0.25s" }}>
                <MenuItem
                  to={URLS.SETTINGS}
                  icon={<RiSettings3Line />}
                  label="Settings"
                />
              </div>
            </nav>
            <div className="pt-0 border-slate-200 border-t-2 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
              <MenuItem to="/" icon={<RiLogoutCircleRLine />} label="Logout" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;