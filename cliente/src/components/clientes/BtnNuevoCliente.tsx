import { useState } from "react";
import React from "react";

function BtnNuevoCliente({estado}) {
  const [formDesactivado, setFormDesactivado] = useState(true);
  const [nuevoDesactivado, setNuevoDesactivado] = useState(false);
   const [stateBtn, setStateBtn] = useState(true);

  const getForm = () => {
    setFormDesactivado(!formDesactivado);
//   setNuevoDesactivado(!nuevoDesactivado);
    setStateBtn(!stateBtn);
  };

  return (
    <>
     
    </>
  );
}

export default BtnNuevoCliente;
