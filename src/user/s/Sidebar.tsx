
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import { FiHome, FiFileText, FiCalendar, FiSettings, FiMenu, FiX } from "react-icons/fi";

function SideBar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navigation = [
    { name: "Dashboard", icon: FiHome, path: "/user/s/dashboard" },
    { name: "Schedules", icon: FiCalendar, path: "/user/s/schedules" },
    { name: "Exams", icon: FiFileText, path: "/user/s/exams" },
    { name: "Settings", icon: FiSettings, path: "/user/s/settings" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-500 hover:text-slate-600 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <FiMenu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 flex z-40 lg:hidden transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-slate-600 bg-opacity-75 transition-opacity ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Side drawer */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
          <div className="px-4 flex items-center justify-between">
            <div className="flex-shrink-0 flex items-center">
              <img src={Logo} alt="EduClass" className="h-8 w-auto" />
              <span className="ml-3 text-xl font-bold text-slate-800">EduClass</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <FiX className="h-6 w-6 text-slate-500" />
            </button>
          </div>
          <div className="mt-5 overflow-y-auto h-full">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-md ${
                    isActive(item.path)
                      ? "bg-primary text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.path)
                        ? "text-white"
                        : "text-slate-500 group-hover:text-slate-700"
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-white lg:pt-5">
        <div className="flex items-center justify-center h-16 px-4">
          <img src={Logo} alt="EduClass" className="h-8 w-auto" />
          <span className="ml-3 text-xl font-bold text-slate-800">EduClass</span>
        </div>
        <div className="flex flex-col flex-grow mt-5 overflow-y-auto">
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(item.path)
                      ? "text-white"
                      : "text-slate-500 group-hover:text-slate-700"
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 mt-auto">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  S
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-700">Student Name</p>
                  <p className="text-xs text-slate-500 mt-0.5">student@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
