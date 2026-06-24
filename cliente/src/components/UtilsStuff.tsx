import React from "react";

export const formatCurrency = (value, currency = `${localStorage.getItem("moneda")}`) => {

  
  const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay:"narrowSymbol"

       
    });
    return formatter.format(value);
  };




  // Esta función acepta CUALQUIER cosa (null, texto, undefined) y nunca se rompe
export const safeFixed = (valor, decimales = 2) => {
  return (valor !== null && valor !== undefined && !isNaN(valor)) 
    ? Number(valor).toFixed(decimales) 
    : "0." + "0".repeat(decimales);
};