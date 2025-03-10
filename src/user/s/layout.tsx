import React from "react";
import { Headbar } from "../../components/Headbar";
import { Link, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiCalendar, 
  FiFileText, 
  FiCheckSquare, 
  FiBookOpen,
  FiSettings
} from "react-icons/fi";
import URLS from "./url";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  showAddHeadbarButton: boolean;
  buttonTitle: string;
  onAddHeadbarButton?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  showAddHeadbarButton,
  buttonTitle,
  onAddHeadbarButton,
}) => {
  const location = useLocation();

  const sidebarItems = [
    { path: URLS.DASHBOARD, label: "Dashboard", icon: <FiHome size={20} /> },
    { path: URLS.SCHEDULE, label: "Schedule", icon: <FiCalendar size={20} /> },
    { path: URLS.EXAMS, label: "Exams", icon: <FiFileText size={20} /> },
    { path: URLS.RESULTS, label: "Results", icon: <FiCheckSquare size={20} /> },
    { path: URLS.CLASSES, label: "Classes", icon: <FiBookOpen size={20} /> },
    { path: URLS.SETTINGS, label: "Settings", icon: <FiSettings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-primary">EduClass</h1>
          <p className="text-sm text-slate-500">Student Portal</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Headbar
          title={title}
          showAddButton={showAddHeadbarButton}
          buttonTitle={buttonTitle}
          onAddButton={onAddHeadbarButton}
        />
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;