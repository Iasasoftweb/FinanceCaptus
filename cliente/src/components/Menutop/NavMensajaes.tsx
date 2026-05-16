import React from "react";
import "./Menutop.css";
import { useMediaQuery } from '@mui/material';
import { Link } from "react-router-dom";
import { MessageSquareText } from "lucide-react";
function NavMensajes() {
  const isMobile = useMediaQuery('(max-width:600px)');
  return (
   <div> 
    {isMobile ? (
       <div></div>
    ) : (
      <div className="icon-badge-container me-3">
      <Link to="/" className="text-decoration-none d-flex">
        <li className="list-unstyled text-decoration-none icon " style={{color:"white"}}>    
          <MessageSquareText size={23} />
        </li>
        <span className="badge bg-success ">2</span>
      </Link>
    </div>
      
    )}
    </div>
  );
}

export default NavMensajes;
