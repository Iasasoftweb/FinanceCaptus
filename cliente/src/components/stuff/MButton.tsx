import React from "react";
import { Button } from "@mui/material";

interface MButtonProps {
  color: string; // Color de fondo
  text: string; // Texto del botón
  variant: "text" | "outlined" | "contained";
  icon: string;
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  disabled?: true | false;
}

const MButton: React.FC<MButtonProps> = ({
  color,
  text,
  variant,
  icon,
  onClick,
  type,
  disabled,
}) => {
  return (
    <>

    
      <Button
        type={type}
        className="mx-1"
        variant={variant}
        style={{
          backgroundColor: color, 
          fontSize: "0.8em",
          textTransform: "capitalize",
          fontWeight: "normal",
          
        }}
        
        onClick={onClick}
        disabled={disabled}
       
      >
        <span className="mx-2 text-white fs-6">{icon}</span> {text}
      </Button>
    </>
  );
};

export default MButton;
