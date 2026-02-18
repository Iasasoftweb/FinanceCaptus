import React from "react";

const FechaCorta = (date) => {
    // Obtener la fecha actual
   
  
    // Obtener día, mes y año
    const dia = String(date.getDate()).padStart(2, '0'); // Asegura 2 dígitos
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
    // Formatear la fecha en dd/mm/yyyy
    
  };
  
  export default FechaCorta;