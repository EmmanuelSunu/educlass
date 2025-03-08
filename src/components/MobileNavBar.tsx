
import React from "react";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";

interface MobileNavBarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const MobileNavBar: React.FC<MobileNavBarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <div className="block md:hidden">
      <button
        onClick={onToggleSidebar}
        className="fixed top-4 left-4 z-20 p-2 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? (
          <RiCloseLine className="text-2xl" />
        ) : (
          <RiMenuLine className="text-2xl" />
        )}
      </button>
      
      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-5"
          onClick={onToggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default MobileNavBar;
