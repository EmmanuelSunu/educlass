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
} from "react-icons/ri";

// ... rest of the sidebar component ...

const sidebarLinks = [
  {
    title: "Dashboard",
    icon: <RiAppsLine />,
    url: "/user/s/dashboard",
  },
  {
    title: "Courses",
    icon: <RiBookOpenLine />,
    url: "/user/s/courses",
  },
  {
    title: "Exams",
    icon: <RiFileList3Line />,
    url: "/user/s/exams",
  },
  {
    title: "Schedule",
    icon: <RiCalendarLine />,
    url: "/user/s/schedules",
  },
  {
    title: "Results",
    icon: <RiMedalLine />,
    url: "/user/s/results",
  },
  {
    title: "Profile",
    icon: <RiUser3Line />,
    url: "/user/s/profile",
  },
  {
    title: "Logout",
    icon: <RiLogoutCircleLine />,
    url: "/logout",
  },
];

// ... rest of the sidebar component ...