import React from "react";

import Logo from "../Brand/Brand";
import Menutop from "../Menutop/Menutop";
import Sidebar from "./Sidebar";

function Header() {
  return (
    <div>
      <header
        id="header"
        className="header fixed-top d-flex align-items-center justify-content-between"
      >
        <Logo /> 
        <Menutop  />
      
      </header>
    </div>
  );
}

export default Header;
