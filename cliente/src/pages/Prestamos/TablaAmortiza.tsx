import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { addDays, format } from "date-fns";
import { Table, useStepContext } from "@mui/material";
import { formatCurrency } from "../../components/UtilsStuff";
import limpiarMonto from "../../components/stuff/LimpiarMonto";
import axios from "axios";
import FechaCorta from "../../components/stuff/fechaCorta";

interface AmortizaData {
  idprestamo: number;
  numcuota: number;
  fechapago: string;
  fechavencimiento: string;
  montocuota: number;
  montocapital: number;
  montointeres: number;
  montomora: number;
  seguro: number;
  montopagado: number;
  capitalpagado: number;
  interespagado: number;
  morapago: number;
  estado: string;
}

interface Totales {
  totalCuotas: number;
  totalInteres: number;
  totalCapitalPagado: number;
  totalSeguro: number;
}

interface Props {
  fechainicio: string;
  tc: number; // Tiempo del crédito (en semanas/meses según frecuencia)
  mc: number; // Monto de la cuota
  loan: number; // Tasa de interés
  ccapital: number; // Capital inicial
  tipo: string; // Tipo de préstamo ("Cuota Fija")
  fre: string; // Frecuencia ("SEMANAL")
  Seguro: number; // Monto del seguro
  modo: string;
}

const TablaAmortiza = ({
  fechainicio,
  tc,
  mc,
  loan,
  ccapital,
  tipo,
  fre,
  Seguro,
  modo,
}: Props) => {
  const [DataAmortiza, setDataAmortiza] = useState<AmortizaData[]>([]);
  const [totales, setTotales] = useState({
    totalCuotas: 0,
    totalInteres: 0,
    totalCapitalPagado: 0,
    totalSeguro: 0,
  });
  const [fechaF, setFechaF]=useState(dayjs)

  const URICuotas = "http://localhost:8000/cuotas/";

  useEffect(() => {
    generarTabla();
    console.log(Seguro);
  }, [fechainicio, tc, mc, loan, ccapital, tipo, fre, Seguro]);

  const insertCuotos = async (data: AmortizaData[]) => {
    try {
      console.log(data);
      const respuesta = await axios.post(URICuotas, data);
      console.log(respuesta);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(limpiarMonto(tc));

  const generarTabla = () => {
    let saldoPendiente = limpiarMonto(ccapital);
    let fecha = new Date(fechainicio);
    let fechaven = dayjs(fechainicio).add(4, 'day' );

    let totalCuotas = 0; // Para sumar el total de las cuotas
    let totalInteres = 0; // Para sumar el total de intereses
    let totalSeguro = 0;
    let InteresFijo =
      (limpiarMonto(ccapital) * (loan / 100) * tc - ccapital) / 13;
    let prorrogacuota = localStorage.getItem('prorrogacuota');

    const tabla: AmortizaData[] = [];
    let totalCapitalPagado = 0; // Para sumar el total de capital pagado
    if (tipo === "Cuota Fija") {
      // Calculo Semanal
      if (fre === "SEMANAL") {
        for (let i = 0; i < tc; i++) {
          const cuotaActual = saldoPendiente < mc ? saldoPendiente : mc;
          const iinteres = InteresFijo;
          const pagado = cuotaActual - InteresFijo;
          const SSeguro = limpiarMonto(Seguro);
          const diasProrroga = localStorage.getItem('prorrogacuota');

          saldoPendiente = saldoPendiente < 0 ? 0 : saldoPendiente;

          totalCuotas += mc - SSeguro;
          totalInteres += iinteres;
          totalCapitalPagado += pagado;
          totalSeguro += SSeguro;
          setFechaF(dayjs(fecha).add(Number(prorrogacuota), 'day'));

           console.log(diasProrroga) 
          tabla.push({
            idprestamo: Number(localStorage.getItem("userID")) || 0,
            numcuota: i + 1,
            fechapago: format(fecha, "dd/MM/yyyy"),
            fechavencimiento: format(fecha, "dd/MM/yyyy"), 
            montocuota: mc + limpiarMonto(Seguro),
            montocapital: cuotaActual - parseFloat(iinteres.toFixed(2)),
            montointeres: parseFloat(iinteres.toFixed(2)),
            montomora: 0.0,
            seguro: limpiarMonto(Seguro) || 0,
            montopagado: iinteres + pagado,
            capitalpagado: 0.0,
            interespagado: 0.0,
            morapago: 0.0,
            estado: "normal",
          });
          fecha = addDays(fecha, 7); // Sumar 7 días para pagos semanales
        }
      }
    }

    setDataAmortiza(tabla);
    console.log(tabla);
    if (modo === "Amortiza") {
      insertCuotos(tabla);
    }

    setTotales({ totalCuotas, totalInteres, totalCapitalPagado, totalSeguro });
  };

  return (
    <div className="p-2">
      <Table className="mi-tabla">
        <thead>
          <tr className="clFont">
            <th className="text-center  " style={{ width: "10" }}>
              #
            </th>
            <th className="clFont text-center">Fecha de Pago</th>
            <th className="clFont text-center">Monto Cuota</th>
            <th className="clFont text-center">Interes</th>
            <th className="clFont text-center">Capital</th>
            <th className="clFont text-center">Seguro</th>

            {/* {tipo !== "Cuota Fija" && <th>Saldo Amortizado</th>} */}
          </tr>
        </thead>
        <tbody>
          {DataAmortiza.map((items) => (
            <tr key={items.numcuota} className="">
              <td
                className="text-center fw-bold bg-info-subtle  p-1"
                style={{ fontSize: "0.7em" }}
              >
                {items.numcuota}
              </td>
              <td className=" text-end p-1" style={{ fontSize: "0.7em" }}>
                {" "}
                {format(items.fechapago, "dd-MM-yyyy")}
              </td>
              <td
                className=" text-end p-1 bg-warning-subtle"
                style={{ fontSize: "0.7em" }}
              >
                {formatCurrency(items.montocuota)}
              </td>
              <td className="text-end p-1" style={{ fontSize: "0.7em" }}>
                {formatCurrency(items.montointeres)}
              </td>
              <td className=" text-end p-1" style={{ fontSize: "0.7em" }}>
                {formatCurrency(items.montocapital)}
              </td>
              <td
                className=" text-end p-1 bg-danger-subtle"
                style={{ fontSize: "0.7em" }}
              >
                {formatCurrency(items.seguro)}
              </td>
            </tr>
          ))}

          <tr className=" clFont bg-light ">
            <td></td>
            <td className="clFont fw-bold text-center"> Totales</td>
            <td className=" fw-bold text-end" style={{ fontSize: "0.9em" }}>
              {" "}
              {formatCurrency(totales.totalCuotas)}
            </td>
            <td className=" fw-bold text-end" style={{ fontSize: "0.9em" }}>
              {" "}
              {formatCurrency(totales.totalInteres)}
            </td>
            <td className=" fw-bold text-end" style={{ fontSize: "0.9em" }}>
              {" "}
              {formatCurrency(totales.totalCapitalPagado)}
            </td>
            <td className=" fw-bold text-end" style={{ fontSize: "0.9em" }}>
              {" "}
              {formatCurrency(totales.totalSeguro)}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default TablaAmortiza;
