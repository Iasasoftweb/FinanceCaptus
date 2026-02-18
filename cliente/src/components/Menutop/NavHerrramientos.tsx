import React from "react";
import './Menutop.css';
import { Link } from "react-router-dom";
function NavHerramientas() {
  return (
    <div className="">
      <Link to="/" className="text-decoration-none ">
        <li className="text-white mx-10 bi bi-gear list-unstyled icon rounded-circle border-1 "></li>
      </Link>
    </div>
  );
}

export default NavHerramientas;
