
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi";

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Create breadcrumb mapping
  const breadcrumbMap: Record<string, string> = {
    user: "User",
    l: "Lecturer",
    s: "Student",
    dashboard: "Dashboard",
    exams: "Exams",
    create: "Create",
    details: "Details",
    schedules: "Schedules",
    grading: "Grading",
    settings: "Settings",
    class: "Classes",
    personal: "Personal Information",
    notifications: "Notification Preferences",
    security: "Password & Security"
  };

  // Determine user type (lecturer or student) from the path
  const userType = pathnames.length > 1 && (pathnames[1] === 'l' || pathnames[1] === 's') 
    ? pathnames[1] 
    : '';

  // Skip the initial segments (user/l or user/s) and start from dashboard
  const relevantPathnames = pathnames.slice(2);
  
  // Handle the case where the current page is dashboard
  if (relevantPathnames.length === 0 || 
     (relevantPathnames.length === 1 && relevantPathnames[0] === 'dashboard')) {
    return (
      <div className="w-full bg-white px-6 py-2 border-b border-slate-200">
        <nav className="flex text-sm">
          <span className="text-slate-600 font-medium">Dashboard</span>
        </nav>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-white px-6 py-2 border-b border-slate-200">
      <nav className="flex text-sm">
        <Link 
          to={`/user/${userType}/dashboard`} 
          className="text-primary hover:text-primary/80 font-medium"
        >
          Dashboard
        </Link>
        
        {relevantPathnames.map((name, index) => {
          // Skip dashboard in the path if it exists
          if (name === 'dashboard') return null;
          
          // Don't create a link for numeric IDs
          const isNumeric = !isNaN(Number(name));
          
          // Build the link path - need to add the prefix back
          const routeTo = `/user/${userType}/${relevantPathnames.slice(0, index + 1).join('/')}`;
          
          // Display name (use mapping or fallback to capitalized name)
          const displayName = isNumeric 
            ? "ID: " + name 
            : (breadcrumbMap[name] || name.charAt(0).toUpperCase() + name.slice(1));
          
          return (
            <React.Fragment key={name + index}>
              <span className="mx-2 text-slate-400 flex items-center">
                <HiChevronRight />
              </span>
              {index === relevantPathnames.length - 1 ? (
                <span className="text-slate-600 font-medium">{displayName}</span>
              ) : (
                <Link
                  to={routeTo}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  {displayName}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumb;
