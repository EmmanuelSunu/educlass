
import React from "react";
import { RiHome3Line } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";

interface HeaderBarProps {
  title: string;
  buttonTitle?: string;
  showAddHeadbarButton?: boolean;
  onAddHeadbarButton?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  showAddHeadbarButton = false,
  onAddHeadbarButton,
  buttonTitle,
}) => {
  const location = useLocation();
  
  // Create breadcrumb items based on current path
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  
  return (
    <header className="bg-white w-full px-6 py-4 border-b border-slate-200">
      <div className="flex flex-col gap-2">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500">
          <Link to="/" className="flex items-center hover:text-blue-600 transition-colors">
            <RiHome3Line className="mr-1" />
            Home
          </Link>
          
          {pathSegments.map((segment, index) => {
            // Build the path up to this segment
            const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
            
            // Format segment for display
            const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);
            
            return (
              <React.Fragment key={index}>
                <span className="mx-2">/</span>
                <Link 
                  to={path} 
                  className={`hover:text-blue-600 transition-colors ${
                    index === pathSegments.length - 1 ? 'font-medium text-blue-600' : ''
                  }`}
                >
                  {formattedSegment}
                </Link>
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Title and optional button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>

          {showAddHeadbarButton && buttonTitle && onAddHeadbarButton && (
            <button
              onClick={onAddHeadbarButton}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {buttonTitle}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
