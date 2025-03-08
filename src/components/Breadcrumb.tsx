
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

  return (
    <div className="w-full bg-white px-6 py-2 border-b border-slate-200">
      <nav className="flex text-sm">
        <Link to="/" className="text-primary hover:text-primary/80 font-medium">
          Home
        </Link>
        
        {pathnames.map((name, index) => {
          // Don't create a link for numeric IDs
          const isNumeric = !isNaN(Number(name));
          
          // Build the link path
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Display name (use mapping or fallback to capitalized name)
          const displayName = isNumeric 
            ? "ID: " + name 
            : (breadcrumbMap[name] || name.charAt(0).toUpperCase() + name.slice(1));
          
          return (
            <React.Fragment key={name + index}>
              <span className="mx-2 text-slate-400 flex items-center">
                <HiChevronRight />
              </span>
              {index === pathnames.length - 1 ? (
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
