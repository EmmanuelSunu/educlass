import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.svg";
import { FaBars, FaRegBell, FaRegUser } from "react-icons/fa";

function Header() {
  return (
    <>
      <div className="fixed lg:hidden flex justify-between w-full px-2 h-max py-4 items-center border-slate-300 border-b bg-white">
        {/* left menu-item */}
        <div className="flex w-2/5 gap-5 justify-between items-center">
          <Link to="#">
            <FaBars className="size-5 fill-gray-500" />
          </Link>
          <Link to="#">
            <img src={Logo} alt="EduClass Logo" className="w-full" />
          </Link>
        </div>

        {/* right menu-items */}
        <div className="w-1/5 flex flex-row justify-between items-center">
          <FaRegBell className="size-5 fill-dark" />
          <div className="rounded-full bg-green-200 p-2">
            <FaRegUser className="size-4 fill-dark" />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div>
            
        </div>
      </div>
    </>
  );
}

export default Header;
