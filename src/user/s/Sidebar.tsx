import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiCalendar, FiBookOpen, FiSettings, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import Logo from "../../assets/images/logo.svg";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  const navigation = [
    { name: "Dashboard", href: "/user/s/dashboard", icon: FiHome },
    { name: "Schedule", href: "/user/s/schedules", icon: FiCalendar },
    { name: "Exams", href: "/user/s/exams", icon: FiBookOpen },
    { name: "Settings", href: "/user/s/settings", icon: FiSettings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden hover:bg-slate-100"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <FiX className="w-6 h-6 text-slate-600" />
        ) : (
          <FiMenu className="w-6 h-6 text-slate-600" />
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
          fixed md:static w-72 bg-white border-r border-slate-200 h-screen 
          z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 flex flex-col h-screen overflow-y-auto">
          <div className="pb-6 w-full">
            <img src={Logo} alt="Logo" className="w-28" />
          </div>
          <div className="flex flex-col h-screen justify-between">
            <nav className="flex flex-col mt-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? "bg-primary text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="pt-0 border-slate-200 border-t-2">
              <Link 
                to="/" 
                className="flex items-center px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                <FiLogOut className="mr-3 h-5 w-5" />
                Logout
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;