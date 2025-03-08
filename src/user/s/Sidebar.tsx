
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import { 
  FiHome, 
  FiCalendar, 
  FiFileText, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX 
} from "react-icons/fi";

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

      {/* Sidebar for desktop */}
      <div
        className={`bg-white w-64 shadow-md flex-shrink-0 h-screen fixed lg:relative z-40 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "left-0" : "-left-64 lg:left-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-6 border-b">
            <img src={Logo} alt="EduClass Logo" className="h-8" />
          </div>
          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
          <div className="p-4 border-t">
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
    </>
  );
}

export default SideBar;
