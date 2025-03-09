import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import { 
  RiDashboardLine, 
  RiBookOpenLine, 
  RiFileList3Line, 
  RiCalendarLine,
  RiMedalLine,
  RiSettings4Line,
  RiLogoutCircleLine
} from "react-icons/ri";

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: <RiDashboardLine className="text-xl" />,
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
      icon: <RiSettings4Line className="text-xl" />,
      url: "/user/s/settings",
    },
    {
      title: "Logout",
      icon: <RiLogoutCircleLine className="text-xl" />,
      url: "/",
    },
  ];

  return (
    <div className="h-screen sticky top-0 w-64 bg-white shadow-sm p-5 flex flex-col">
      <div className="mb-10">
        <Link to="/user/s/dashboard">
          <img src={Logo} alt="Logo" className="h-8" />
        </Link>
      </div>

      <div className="space-y-3">
        {sidebarLinks.map((link, index) => (
          <Link
            key={index}
            to={link.url}
            className={`flex items-center justify-start gap-3 w-full p-2 py-3 pl-4
                rounded-md fill-slate-400 text-slate-400 font-medium 
                hover:bg-slate-100 hover:text-primary hover:font-semibold hover:fill-primary hover:ease-in
                ${
                  currentPath === link.url
                    ? "bg-slate-100 text-h6 !text-primary fill-primary !font-semibold transition duration-150 ease-out"
                    : ""
                }`}
          >
            <div className="text-2xl fill-current">{link.icon}</div>
            <h6>{link.title}</h6>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;