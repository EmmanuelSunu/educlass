
import React, { useState } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";

interface MobileNavBarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const MobileNavBar: React.FC<MobileNavBarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-20 border-b border-slate-100 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onToggleSidebar}
          className="text-slate-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <RiCloseLine className="h-6 w-6" />
          ) : (
            <RiMenu3Line className="h-6 w-6" />
          )}
        </button>
        <div className="text-slate-800 font-medium">EduClass</div>
        <div className="w-6"></div> {/* Empty div for balanced spacing */}
      </div>
    </div>
  );
};

export default MobileNavBar;
