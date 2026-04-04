import React, { useState, useEffect } from "react";
import { LuUser2 } from "react-icons/lu";
import Favatar from "../../assets/img/favatar.png";
import Mavatar from "../../assets/img/mavatar.png";
import "./Menutop.css";
import { useMediaQuery } from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PiUserCheckLight } from "react-icons/pi";
import { Avatar } from "@mui/material";
import { RxAvatar } from "react-icons/rx";

function NavAvatar() {
  const handleLogout = () => {
    // Elimina el token del localStorage
    localStorage.removeItem("token");

    // Redirige al login
    // navigate('/login',  { replace: true });

    window.location.replace("/login");
  };

  const userURI = "http://localhost:5000/usuarios/";
  const UriImg = "http://localhost:5000/uploadusers/";

  const isMobile = useMediaQuery("(max-width:600px)");

  const [nomUsuario, setNomUsuario] = useState(null);
  const [tipoRol, setTipoRol] = useState(null);
  const [userData, setUserData] = useState([]);
  
  const getNombreUsuario = (items) => {
    setNomUsuario(items);
  };

  const geTipoRol = (items) => {
    setTipoRol(items);
  };
  const getUser = async () => {
    try {
      const id = localStorage.getItem("userID");
     
      await axios.get(`${userURI}${id}`).then((response) => {
        const dataUser = response.data;
        const avata = dataUser.avata
        setUserData(response.data);
        
        
        
      });
    } catch (error) {
      console.error("Error en consulta :", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      {isMobile ? (
        <div></div>
      ) : (
        <div>
          <li className="nav-item dropdown pe-3 list-unstyled lh-1">
            <Link
              to="/"
              className="nav-link nav-profile d-flex align-content-center pe-0 text-decoration-none"
              data-bs-toggle="dropdown"
            >
              {userData.map((item) => (
                <div
                  className="d-flex justify-content-center align-items-center"
                  key={item.id}
                >
                  <Avatar
                    src={`${UriImg}${item.avata}`}
                    sx={{ width: 40, height: 40 }}
                    className="mx-2"
                  />
                  {/* <span className="items fw-bold"> {item.nombreusuario}</span> */}
                </div>
              ))}
            </Link>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile ">
            <li className="dropdown-header  text-black">
              {userData.map((item) => (
               
                 <div className="d-flex justify-content-end"  key={item.id}>
                  
                 <Avatar
                    src={`${UriImg}${item.avata ? item.avata : <RxAvatar />}`}
                    sx={{ width: 40, height: 40 }}
                    className="mx-1"
                  />
                  <div>
                    <span className=" fw-bold clFont  ">
                      {item.nombreusuario}
                    </span>
                    <br></br>
                    <span className="fw-light clFont">
                      {item.tbrole.nombre}
                    </span>
                  </div>
                 </div>
                   ))}
                </li>
             

              <li className="dropdown-divider"> </li>

             
              <Link
                to="/usuarios"
                className="dropdown-item items py-3 bg-light text-black-50"
              >
                <span className="text-success fs-6 me-2">
                  {" "}
                  <PiUserCheckLight />
                </span>
                Usuarios del Sistema
              </Link>

              <Link
                to="/logout"
                onClick={handleLogout}
                className="dropdown-item items py-3 text-black-50"
              >
                <span className="bi bi-gear text-danger fs-6 me-2"></span>{" "}
                Cerrar Sesión
              </Link>
            </ul>
          </li>
        </div>
      )}
    </div>
  );
}

export default NavAvatar;
