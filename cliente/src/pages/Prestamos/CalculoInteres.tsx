import React, { useState, useEffect } from "react";
import limpiarMonto from "../../components/stuff/LimpiarMonto";
import Swal from "sweetalert2";

const CalculoInteres = (
  mc,
  ttcuota,
  montoCuota,
  TipoAmortizacion,
  FFrecuencia
) => {

      const NumeroCuota = Number(ttcuota);
      const amortiza = TipoAmortizacion; 

    if (amortiza === "Cuota Fija") {
      const R = limpiarMonto(montoCuota) * NumeroCuota - limpiarMonto(mc);
      let RS = (R / limpiarMonto(mc)) * 100;

      if (FFrecuencia === "SEMANAL") {
        console.log(FFrecuencia);
        const interes = RS / (Number(NumeroCuota) / 4.333);
        return interes;
      }

      if (FFrecuencia === "DIARIO") {
        const interes = RS / (NumeroCuota / 1.555);
        return interes;
      }

      if (FFrecuencia === "QUINCENAL") {
        const interes = RS / (NumeroCuota / 1.555);
        return interes;
      }

  };

  return null;
};

export default CalculoInteres;
