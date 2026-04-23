import React, { useState } from "react";
// import "../../pages/Dashboard/Dashboard.css";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../Brand/Brand";
import "./DashStyle.css";

import { AiOutlineDashboard } from "react-icons/ai";
import { PiUsers } from "react-icons/pi";
import { BsPiggyBank } from "react-icons/bs";
import { PiCashRegisterLight } from "react-icons/pi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { GrMoney } from "react-icons/gr";
import { PiCalculatorLight } from "react-icons/pi";
import { PiMapPinArea } from "react-icons/pi";
import { Link } from "react-router-dom";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
} from "react-icons/bs";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <Link to="/" className="sindecoracion">
            <Logo />
          </Link>
          <hr className="bg-info border-info border-1 " />
        </div>
        <span className="icon close_icon text-white" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item ">
          <Link to="/" className="text-white">
            <AiOutlineDashboard className="icon" /> Dashboard
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/showclientes" className="text-white">
            <PiUsers className="icon" /> Clientes
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="" className="text-white">
            <BsPiggyBank className="icon" /> Préstamos
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="" className="text-white">
            <PiCashRegisterLight className="icon" /> Pagos
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="" className="text-white">
            <HiOutlineClipboardDocumentList className="icon" /> Estados de
            Cuenta
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="" className="text-white">
            <GrMoney className="icon" /> Gastos
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="" className="text-white">
            <PiCalculatorLight className="icon" /> Calculadora
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="/rutas" className="text-white">
            <PiMapPinArea className="icon" /> Rutas
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="" className="text-white">
            <PiCalculatorLight className="icon" /> Reportes
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/usuarios" className="text-white">
            <PiCalculatorLight className="icon" /> Usuarios
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="" className="text-white">
            <BsFillGearFill className="icon" /> Configuración
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
