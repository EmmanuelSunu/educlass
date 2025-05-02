import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiBarChart2,
  FiLogOut,
  FiBookOpen,
  FiUser,
} from "react-icons/fi";
import Logo from "../../assets/images/logo.svg";

interface SidebarProps {
  className?: string;
}

const AdminSidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      icon: <FiHome className="w-5 h-5" />,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: <FiBook className="w-5 h-5" />,
      label: "Programs",
      path: "/admin/programs",
      subItems: [
        {
          label: "Analytics",
          path: "/admin/programs/analytics",
        },
      ],
    },
    {
      icon: <FiUsers className="w-5 h-5" />,
      label: "Lecturers",
      path: "/admin/lecturers",
    },
    {
      icon: <FiUser className="w-5 h-5" />,
      label: "Students",
      path: "/admin/students",
    },
    {
      icon: <FiBookOpen className="w-5 h-5" />,
      label: "Courses",
      path: "/admin/courses",
    },
    {
      icon: <FiBarChart2 className="w-5 h-5" />,
      label: "Analytics",
      path: "/admin/analytics",
      subItems: [
        {
          label: "Main Analytics",
          path: "/admin/analytics",
        },
        {
          label: "Student Analytics",
          path: "/admin/analytics/students",
        },
        {
          label: "Course Analytics",
          path: "/admin/analytics/courses",
        },
      ],
    },
  ];

  return (
    <aside
      className={`
        fixed md:static w-72 bg-white border-r-2 border-slate-200 h-[100dvh] 
        z-40 transition-transform duration-300 ease-in-out
        ${className || ""}
      `}
    >
      <div className="p-4 flex flex-col h-full overflow-y-auto">
        <div className="pb-4 w-full">
          <img src={Logo} alt="Logo" className="w-28" />
          <p className="text-sm text-slate-500 mt-1">Admin Portal</p>
        </div>
        <div className="flex flex-col h-full justify-between">
          <nav className="flex flex-col mt-4 space-y-1">
            {navItems.map((item, index) => (
              <div 
                key={item.path} 
                className="animate-slideInLeft" 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </div>
            ))}
          </nav>
          <div className="mt-auto pt-4 border-t border-slate-200">
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar; 