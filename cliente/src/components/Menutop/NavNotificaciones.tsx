import React from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RxFontSize } from "react-icons/rx";
import "./Menutop.css";
import { useMediaQuery } from "@mui/material";
import { Bell } from "lucide-react";
import { MisColores } from "../stuff/MisColores";

function NavNotificaciones() {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <div>
      {isMobile ? (
        <div></div>
      ) : (
        <div className="icon-badge-container me-3">
          <a href="/" className="text-decoration-none d-flex">
            <li className=" mx-2 bi bi-bell list-unstyled text-decoration-none icon" >
              <Bell size={23} color={MisColores.blanco} />
            </li>
            <span className="badge bg-danger">2</span>
          </a>
        </div>
      )}
      
    </div>
  );
}

export default NavNotificaciones;
