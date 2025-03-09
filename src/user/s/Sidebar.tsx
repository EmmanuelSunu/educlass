
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import MenuItem from "../../components/menu-itens";
import { 
  RiDashboardLine, 
  RiBookOpenLine, 
  RiFileList3Line, 
  RiCalendarLine,
  RiMedalLine,
  RiSettings4Line,
  RiLogoutCircleRLine
} from "react-icons/ri";
import URLS from "./url";

function Sidebar() {
  const location = useLocation();

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
      icon: <RiLogoutCircleRLine className="text-xl" />,
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
          <MenuItem
            key={index}
            to={link.url}
            icon={link.icon}
            label={link.title}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
