
import React from "react";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";

interface MobileNavBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const MobileNavBar: React.FC<MobileNavBarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <div className="block md:hidden">
      <button
        onClick={onToggleSidebar}
        className="fixed top-4 right-4 z-30 p-2 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? (
          <RiCloseLine className="h-6 w-6 text-slate-600" />
        ) : (
          <RiMenuLine className="h-6 w-6 text-slate-600" />
        )}
      </button>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={onToggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default MobileNavBar;
