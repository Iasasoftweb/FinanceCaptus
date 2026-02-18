import React, { useEffect, useState } from "react";
import limpiarMonto from "../../components/stuff/LimpiarMonto";
import { addDays, format } from "date-fns";
import { MdVaccines } from "react-icons/md";
import dayjs from "dayjs";

interface AmortizaData {
  numcuota: number;
  fechapago: string;
  fechavencimiento: string;
  montocuota: number;
  montocapital: number;
  montointeres: number;
  seguro: number;
  estado: string;
  pagada: string;
}

interface AmortizaProps {
  fechainicio: string;
  tc: number;
  mc: number;
  loan: number;
  ccapital: number;
  tipo: string;
  fre: string;
  seguro: number;
}

const getAmortizaData: React.FC<AmortizaProps> = ({
  fechainicio,
  tc,
  mc,
  loan,
  ccapital,
  tipo,
  fre,
  seguro,
}) => {
  console.log(tc, mc, loan, ccapital, tipo, fre, seguro);

  let saldoPendiente = limpiarMonto(ccapital);
  let fecha = new Date(fechainicio);
  
  let InteresFijo =
    (limpiarMonto(ccapital) * (loan / 100) * tc - ccapital) / 13;
  let prorrogaCuotas = Number(localStorage.getItem("prorrogacuota"));  

  const tabla: AmortizaData[] = [];

  if (tipo === "Cuota Fija" && fre === "SEMANAL") {
    for (let i = 0; i < tc; i++) {
      const cuotaActual = mc;
      const iinteres = InteresFijo;
      const pagado = cuotaActual - InteresFijo;
      const SSeguro = limpiarMonto(seguro);
      
      
      saldoPendiente = saldoPendiente < 0 ? 0 : saldoPendiente;
      console.log(prorrogaCuotas)
      tabla.push({
        numcuota: i + 1,
        fechapago: format(fecha, "MM-dd-yyyy"),
        fechavencimiento: format((addDays(fecha, prorrogaCuotas)), 'MM-dd-yyyy'), 
        montocuota: mc + SSeguro,
        montocapital: cuotaActual - parseFloat(iinteres.toFixed(2)),
        montointeres: parseFloat(iinteres.toFixed(2)),
        seguro: SSeguro || 0,
        estado: "normal",
        pagada: "false",

      });
      fecha = addDays(fecha, 7);
    }
  }

  console.log(tabla);

  return tabla;
};

export default getAmortizaData;
