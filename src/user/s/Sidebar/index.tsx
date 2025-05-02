import { Link, useLocation } from "react-router-dom";
import { FiHome, FiBook, FiClipboard, FiUser, FiLogOut } from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    // Special case for dashboard since it's the root
    if (path === "/user/s/dashboard") {
      return location.pathname === path;
    }
    // For other routes, check if the current path starts with the menu path
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      icon: <FiHome className="w-5 h-5" />,
      label: "Dashboard",
      path: "/user/s/dashboard",
    },
    {
      icon: <FiBook className="w-5 h-5" />,
      label: "My Courses",
      path: "/user/s/classes",
    },
    {
      icon: <FiClipboard className="w-5 h-5" />,
      label: "Exams",
      path: "/user/s/exams",
    },
    {
      icon: <FiUser className="w-5 h-5" />,
      label: "Profile",
      path: "/user/s/profile",
    },
  ];

  return (
    <aside className="bg-white border-r border-slate-200 w-64 h-screen sticky top-0 z-30 hidden lg:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-200">
          <Link to="/user/s/dashboard" className="text-xl font-bold text-primary">
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
                      ? "bg-primary text-white hover:bg-primary/90"
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