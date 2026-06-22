import React, { useState, useEffect } from "react";
import { useMediaQuery, Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Iconos
import { PiUserCheckLight } from "react-icons/pi";
import { RxAvatar } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi"; // Icono más profesional para logout

import "./Menutop.css";

function NavAvatar() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Estado inicial como null para validar carga
  const [user, setUser] = useState(null);

  const userURI = "http://localhost:5000/usuarios/";
  const UriImg = "http://localhost:5000/uploads/clientes/avatauser/";

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    window.location.replace("/login");
  };

  const getUser = async () => {
    try {
      const id = localStorage.getItem("userID");
      if (!id) return;

      const response = await axios.get(`${userURI}${id}`);
      // Asumimos que la API devuelve el objeto del usuario directamente o response.data[0]
      setUser(Array.isArray(response.data) ? response.data[0] : response.data);
    } catch (error) {
      console.error("Error en consulta:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Si no hay usuario cargado aún, no renderizamos nada o un spinner
  if (!user || isMobile) return null;

  return (
    <li className="nav-item dropdown">
      {/* Botón del Nav (Trigger) */}
      <Link
        to="#"
        className="nav-link nav-profile d-flex align-items-center pe-0"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <Avatar
          src={user.avata ? `${UriImg}${user.avata}` : ""}
          sx={{
            width: 38,
            height: 38,
            border: "2px solid #fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <RxAvatar size={24} />
        </Avatar>
      </Link>

      {/* Menú Desplegable Estilizado */}
      <ul
        className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 mt-2 overflow-hidden compact-dropdown"
        style={{ minWidth: "220px" }}
      >
        {/* Cabecera más delgada */}
        <li
          className="px-3 py-2 bg-light border-bottom "
          style={{ lineHeight: "2em" }}
        >
          <div className="d-flex align-items-center">
            <Avatar
              src={user.avata ? `${UriImg}${user.avata}` : ""}
              sx={{ width: 32, height: 32, mr: 2 }} // Avatar más pequeño
            >
              <RxAvatar size={24} />
            </Avatar>
            <div className="lh-1">
              {" "}
              {/* lh-1 reduce el interlineado */}
              <h6
                className="mb-0 fw-bold text-dark"
                style={{ fontSize: "14px" }}
              >
                {user.nombreusuario}
              </h6>
              <small
                className="text-primary fw-semibold text-uppercase"
                style={{ fontSize: "9px", letterSpacing: "0.3px" }}
              >
                {user.tbrole?.nombre || "Usuario"}
              </small>
            </div>
          </div>
        </li>

        {/* Opciones con menos altura */}
        <li className="" style={{ lineHeight: "2em" }}>
          <Link
            to="/usuarios"
            className="dropdown-item d-flex align-items-center py-1.5 px-3 transition-all"
          >
            <PiUserCheckLight className="text-success fs-6 me-2" />
            <span className="text-secondary small">Usuarios del Sistema</span>
          </Link>
        </li>

        <li style={{ lineHeight: "2em" }}>
          <Link
            to="/configuracion"
            className="dropdown-item d-flex align-items-center py-1.5 px-3"
          >
            <i className="bi bi-gear text-muted fs-6 me-2"></i>
            <span className="text-secondary small">Configuración</span>
          </Link>
        </li>

        <li>
          <hr className="dropdown-divider my-1 opacity-25" />
        </li>

        <li className="bg-body-tertiary" style={{ lineHeight: "2em" }}>
          <Link
            to="/logout"
            onClick={handleLogout}
            className="dropdown-item d-flex align-items-center py-2 px-3 text-danger fw-medium"
          >
            <BiLogOutCircle className="fs-6 me-2" />
            <span className="small">Cerrar Sesión</span>
          </Link>
        </li>
      </ul>
    </li>
  );
}

export default NavAvatar;
