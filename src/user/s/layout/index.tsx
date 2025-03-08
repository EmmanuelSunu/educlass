
import React, { useState, useEffect } from 'react';
import HeaderBar from '../../../components/HeaderBar';
import Sidebar from '../Sidebar';
import { RiMenu2Line, RiCloseLine } from 'react-icons/ri';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showAddHeadbarButton?: boolean;
  buttonTitle?: string;
  onAddHeadbarButton?: () => void;
}

const DashboardLayout: React.FC<LayoutProps> = ({
  children,
  title,
  showAddHeadbarButton = false,
  buttonTitle = 'Add New',
  onAddHeadbarButton,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicked outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderBar 
          title={title} 
          showAddButton={showAddHeadbarButton} 
          buttonTitle={buttonTitle} 
          onAddButtonClick={onAddHeadbarButton} 
        />
        
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden absolute top-4 left-4 z-40 p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
        >
          {sidebarOpen ? <RiCloseLine size={24} /> : <RiMenu2Line size={24} />}
        </button>
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
