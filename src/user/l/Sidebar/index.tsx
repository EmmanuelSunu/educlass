import { Link, useLocation } from "react-router-dom";
import { FiHome, FiBook, FiClipboard, FiCalendar, FiAward, FiSettings, FiLogOut } from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      icon: <FiHome className="w-5 h-5" />,
      label: "Dashboard",
      path: "/user/l/dashboard",
    },
    {
      icon: <FiBook className="w-5 h-5" />,
      label: "Classes",
      path: "/user/l/class",
    },
    {
      icon: <FiClipboard className="w-5 h-5" />,
      label: "Exams",
      path: "/user/l/exams",
    },
    {
      icon: <FiCalendar className="w-5 h-5" />,
      label: "Schedules",
      path: "/user/l/schedules",
    },
    {
      icon: <FiAward className="w-5 h-5" />,
      label: "Grading",
      path: "/user/l/grading",
    },
    {
      icon: <FiSettings className="w-5 h-5" />,
      label: "Settings",
      path: "/user/l/settings",
    },
  ];

  return (
    <aside className="bg-white border-r border-slate-200 w-64 h-screen sticky top-0 z-30 hidden lg:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-200">
          <Link to="/user/l/dashboard" className="text-xl font-bold text-primary">
            ED4
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-md transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => {
              // Handle logout
              window.location.href = "/";
            }}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-md w-full text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 