import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../assets/images/logo.svg";
import {
  RiAppsLine,
  RiBookOpenLine,
  RiCalendarLine,
  RiFileList3Line,
  RiLogoutCircleLine,
  RiMedalLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiUser3Line,
  RiSettingsLine,
} from "react-icons/ri";
import { IoChevronForwardOutline } from "react-icons/io5";
import Breadcrumb from "../../../components/Breadcrumb";
import ButtonProps from "../../../components/ButtonProps";

interface SidebarProps {
  className?: string;
}

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
  showAddHeadbarButton?: boolean;
  onAddHeadbarButton?: () => void;
  buttonTitle?: string;
}

const sidebarLinks = [
  {
    title: "Dashboard",
    icon: <RiAppsLine className="text-xl" />,
    url: "/user/s/dashboard",
  },
  {
    title: "Courses",
    icon: <RiBookOpenLine className="text-xl" />,
    url: "/user/s/courses",
  },
  {
    title: "Exams",
    icon: <RiFileList3Line className="text-xl" />,
    url: "/user/s/exams",
  },
  {
    title: "Schedule",
    icon: <RiCalendarLine className="text-xl" />,
    url: "/user/s/schedules",
  },
  {
    title: "Results",
    icon: <RiMedalLine className="text-xl" />,
    url: "/user/s/results",
  },
  {
    title: "Settings",
    icon: <RiSettingsLine className="text-xl" />,
    url: "/user/s/settings",
  },
  {
    title: "Logout",
    icon: <RiLogoutCircleLine className="text-xl" />,
    url: "/logout",
  },
];

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={`bg-white border-r border-slate-200 h-screen transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      } fixed top-0 left-0 z-30 ${className}`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="h-8 w-8" />
          {isExpanded && (
            <span className="ml-2 font-bold text-primary text-lg">EduClass</span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-primary"
        >
          {isExpanded ? <RiMenuFoldLine size={20} /> : <RiMenuUnfoldLine size={20} />}
        </button>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.url || location.pathname.startsWith(link.url + "/");
            return (
              <li key={link.url}>
                <Link
                  to={link.url}
                  className={`flex items-center py-3 px-3 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {isExpanded && (
                    <>
                      <span className="ml-3">{link.title}</span>
                      {isActive && (
                        <IoChevronForwardOutline className="ml-auto text-sm" />
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  children,
  showAddHeadbarButton = false,
  onAddHeadbarButton,
  buttonTitle = "Add New",
}) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64 transition-all duration-300">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <div className="flex items-center text-sm">
                <span className="font-medium text-slate-700">Student</span>
              </div>
            </div>
          </div>
        </header>
        <div className="pt-4 px-8">
          <Breadcrumb />
          <div className="flex items-center justify-between mb-6 mt-4">
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            {showAddHeadbarButton && (
              <ButtonProps onClick={onAddHeadbarButton}>
                {buttonTitle}
              </ButtonProps>
            )}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;