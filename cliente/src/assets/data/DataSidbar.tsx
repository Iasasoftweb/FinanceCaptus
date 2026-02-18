import React from "react";

import { IoHomeOutline } from "react-icons/io5";
import { TbUsers } from "react-icons/tb";
import { PiPiggyBank } from "react-icons/pi";
import { GrMapLocation } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LiaUsersCogSolid } from "react-icons/lia";
import { LiaToolsSolid } from "react-icons/lia";
import { FaBars } from "react-icons/fa6";

const DataSidebar = () => {

    const sideBarItems = [
        {
          label: "Home",
          icon: <IoHomeOutline />,
          path: "/",
          name: "",
        },
        {
          label: "Clientes",
          icon: <TbUsers />,
          path: "/",
          name: "",
        },
        {
          label: "Préstamos",
          icon: <PiPiggyBank />,
          path: "/",
          name: "",
        },
        {
          label: "Rutas",
          icon: <GrMapLocation />,
          path: "/",
          name: "",
        },
        {
          label: "Reportes",
          icon: <HiOutlineDocumentReport />,
          path: "/",
          name: "",
        },
        {
          label: "Usuarios",
          icon: <LiaUsersCogSolid />,
          path: "/",
          name: "",
        },
    
        {
          label: "Configuracion",
          icon: <LiaToolsSolid />,
          path: "/",
          name: "",
        },
      ];
    
}

export default DataSidebar;