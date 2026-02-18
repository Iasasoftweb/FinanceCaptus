import React from "react";

export const formatCurrency = (value, currency = `${localStorage.getItem("moneda")}`) => {

  
  const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay:"narrowSymbol"

       
    });
    return formatter.format(value);
  };