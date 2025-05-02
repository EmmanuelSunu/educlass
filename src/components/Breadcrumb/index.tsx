import { Link, useLocation } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Map path segments to readable names
  const getPathName = (path: string) => {
    const pathMap: { [key: string]: string } = {
      user: "User",
      s: "Student",
      l: "Lecturer",
      dashboard: "Dashboard",
      exams: "Exams",
      classes: "Classes",
      profile: "Profile",
      take: "Take Exam",
      details: "Details",
      results: "Results",
    };

    return pathMap[path] || path;
  };

  return (
    <nav className="flex items-center space-x-2 mb-6 text-sm">
      <Link
        to="/"
        className="text-slate-500 hover:text-primary transition-colors"
      >
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <div key={name} className="flex items-center space-x-2">
            <FiChevronRight className="text-slate-400" />
            {isLast ? (
              <span className="text-slate-800 font-medium">
                {getPathName(name)}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="text-slate-500 hover:text-primary transition-colors"
              >
                {getPathName(name)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb; 