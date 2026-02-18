import React from "react";
import "./Menutop.css";
import NavAvatar from "./NavAvatat";
import NavNotificaciones from "./NavNotificaciones";
import NavMensajes from "./NavMensajaes";

function Menutop() {
  return (
    <div>
      <nav className="header-nav ms-auto p-4 mt-4">
        
        <ul className="d-flex">
    
          <NavNotificaciones />

          <NavMensajes />

          <NavAvatar />
        </ul>
      </nav>
    </div>
  );
}

export default Menutop;
