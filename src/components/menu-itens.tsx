import React from "react";
import { Link, useLocation } from "react-router-dom";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  className?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, to, className = "" }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-gray-700 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-primary-500 bg-opacity-10 text-primary-500"
          : "hover:bg-gray-100"
      } ${className}`}
    >
      <span className={`${isActive ? "text-primary-500" : ""} transition-transform duration-200`}>{icon}</span>
      <span className={`ml-3 font-medium ${isActive ? "text-primary-500" : ""} transition-all duration-200`}>
        {label}
      </span>
    </Link>
  );
};

export default MenuItem;