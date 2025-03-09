import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import MenuItem from "../../components/menu-itens";
import { 
  RiDashboardLine, 
  RiBookOpenLine, 
  RiCalendarLine,
  RiMedalLine,
  RiSettings4Line,
  RiLogoutCircleLine //Corrected the typo here
} from "react-icons/ri";
import URLS from "./url";

function Sidebar() {
  const location = useLocation();

  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: <RiDashboardLine className="text-xl" />,
      url: URLS.DASHBOARD,
    },
    {
      title: "Exams",
      icon: <RiMedalLine className="text-xl" />,
      url: URLS.EXAMS,
    },
    {
      title: "Schedule",
      icon: <RiCalendarLine className="text-xl" />,
      url: URLS.SCHEDULE,
    },
    {
      title: "Settings",
      icon: <RiSettings4Line className="text-xl" />,
      url: URLS.SETTINGS,
    },
    {
      title: "Logout",
      icon: <RiLogoutCircleLine className="text-xl" />, //Corrected the typo here
      url: "/",
    },
  ];

  return (
    <div className="bg-white text-dark border-r min-h-screen w-72 px-4 py-5 hidden lg:block">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <img src={Logo} alt="EduClass Logo" className="w-32" />
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
    </div>
  );
}

export default Sidebar;