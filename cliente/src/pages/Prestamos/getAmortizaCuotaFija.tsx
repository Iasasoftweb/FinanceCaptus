import { addDays } from "date-fns";
import limpiarMonto from "../../components/stuff/LimpiarMonto";
import { safeFixed } from "../../components/UtilsStuff";

interface AmortizaData {
  numcuota: number;
  fechapago: string;
  fechavencimiento: string;
  montocuota: number;
  montocapital: number;
  montointeres: number;
  seguro: number;
  saldoPendiente: number;
  estado: string;
  pagada: string;
}

interface AmortizaProps {
  fechainicio: string;
  tc: number; // total cuotas
  mc: number; // monto cuota fija
  loan: number; // interés %
  ccapital: number; // capital préstamo
  tipo: string;
  fre: string;
  seguro: number;
}

const getAmortizaData = ({
  fechainicio,
  tc,
  mc,
  loan,
  ccapital,
  tipo,
  fre,
  seguro,
}: AmortizaProps): AmortizaData[] => {
  const tabla: AmortizaData[] = [];

  console.log(tabla);
  const capital = limpiarMonto(ccapital);

  let saldoPendiente = capital;

  let fecha = new Date(fechainicio);

  const cuotaFija = limpiarMonto(mc);

  const seguroMonto = limpiarMonto(seguro);

  const prorrogaCuotas = Number(localStorage.getItem("prorrogacuota") || 0);

  // TASA POR PERIODO
  // ejemplo:
  // 4% mensual = 0.04
  const tasa = loan / 100;

  if (tipo === "Cuota Fija") {
    // Definimos cuántos días sumar según la frecuencia elegida
    let diasASumar = 7;
    if (fre === "QUINCENAL") diasASumar = 15;
    if (fre === "MENSUAL") diasASumar = 30; // O usar addMonths(fecha, 1) de date-fns

    for (let i = 0; i < tc; i++) {
      const interes = saldoPendiente * tasa;
      let capitalPagado = cuotaFija - interes;

      if (capitalPagado > saldoPendiente) {
        capitalPagado = saldoPendiente;
      }

      saldoPendiente -= capitalPagado;
      if (saldoPendiente < 0) saldoPendiente = 0;

      tabla.push({
        numcuota: i + 1,
        fechapago: fecha.toISOString().split("T")[0],
        fechavencimiento: addDays(fecha, prorrogaCuotas)
          .toISOString()
          .split("T")[0],
        montocuota: parseFloat(safeFixed((cuotaFija + seguroMonto),2)),
        montocapital: parseFloat(safeFixed(capitalPagado,2)),
        montointeres: parseFloat(safeFixed(interes,2)),
        seguro: parseFloat(safeFixed(seguroMonto,2)),
        saldoPendiente: parseFloat(safeFixed(saldoPendiente,2)),
        estado: "normal",
        pagada: "false",
      });

      // Avanzar la fecha según la frecuencia dinámica
      fecha = addDays(fecha, diasASumar);
    }
  }

  return tabla;
};

export default getAmortizaData;
