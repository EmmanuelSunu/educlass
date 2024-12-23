import { NavLink } from "react-router-dom";
import Logo from "../assets/images/logo.svg";
import MenuItem from "./menui-itens";
import { RiDashboardHorizontalLine, RiUserLine ,RiArticleLine, RiGraduationCapLine, RiCalendarEventLine, RiLineChartLine     } from "react-icons/ri";


function Sidebar() {
  return (
    <>
      <div className="w-1/6 bg-white border-r-2 border-gray-200 h-screen p-4">
        <div className="pb-4  w-full">
          <img src={Logo} alt="" className="w-28" />
        </div>
        <nav className="flex flex-col mt-4 space-y-2">
          <MenuItem to="/user" icon={<RiDashboardHorizontalLine />} label="Overview" />
          <MenuItem to="/schedule " icon={<RiCalendarEventLine />} label="Schedules" />
          <MenuItem to="/exams" icon={<RiArticleLine />} label="Exams" />
          <MenuItem to="/students" icon={<RiGraduationCapLine />} label="Students" />
          <MenuItem to="/grading" icon={<RiLineChartLine />} label="Grading" />
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
