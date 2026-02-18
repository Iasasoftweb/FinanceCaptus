import React from "react";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
} from "react-icons/bs";
import "./DashStyle.css";
import NavAvatar from "../Menutop/NavAvatat";
import NavNotificaciones from "../Menutop/NavNotificaciones";
import NavMensajes from "../Menutop/NavMensajaes";
import Brand from "../Brand/Brand";

function Nav() {
  return (
    <header className="header d-flex align-content-center justify-content-between">
      <div className="menu-icon">
        {/* <BsJustify className="icon" onClick={OpenSidebar} /> */}
      </div>
      <div className="header-left">
        {/* <BsSearch className="icon" onClick={OpenSidebar} /> */}
      </div>
      <div className=" d-lg-none d-flex justify-content-center align-content-center">
        <Brand />
      </div>
      <div>
        
      </div>
      <div className="header-right ">
        <NavNotificaciones />
        <NavMensajes />
        <NavAvatar />
        {/* <BsFillBellFill className='icon'/>
            <BsFillEnvelopeFill className='icon'/>
            <BsPersonCircle className='icon'/> */}
      </div>
    </header>
  );
}

export default Nav;
