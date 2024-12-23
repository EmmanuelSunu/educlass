import { NavLink } from "react-router-dom";

interface MenuItemProps {
  to: string; // Path for the NavLink
  icon: JSX.Element; // Icon component, e.g., <FaHouse />
  label: string; // Text label, e.g., "Dashboard"
}

function MenuItem({ to, icon, label }: MenuItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-start gap-3 w-full p-2 py-3 pl-4
         rounded-md fill-slate-400 text-slate-400 font-medium 
         hover:bg-slate-100 hover:text-primary hover:fill-primary hover:ease-in
         ${
           isActive
             ? "bg-slate-100 text-h6 !text-primary fill-primary !font-semibold transition duration-150 ease-out"
             : ""
         }`
      }
    >
      <div className="text-2xl fill-current">{icon}</div>
      <h6>{label}</h6>
    </NavLink>
  );
}

export default MenuItem;
