import React from "react";

const limpiarMonto = (monto) => {
   if (typeof monto=='string'){
    return Number(monto.replace(/[^0-9.]/g, ""));
   } else {
    return Number(monto);
   }
     // Elimina todo excepto números y punto decimal
  };

  export default limpiarMonto