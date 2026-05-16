import { addDays } from "date-fns";
import limpiarMonto from "../../components/stuff/LimpiarMonto";

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

  if (tipo === "Cuota Fija" && fre === "SEMANAL") {
    for (let i = 0; i < tc; i++) {
      // INTERÉS SOBRE SALDO
      const interes = saldoPendiente * tasa;

      // CAPITAL PAGADO
      let capitalPagado = cuotaFija - interes;

      // EVITAR QUE LA ÚLTIMA CUOTA SE PASE
      if (capitalPagado > saldoPendiente) {
        capitalPagado = saldoPendiente;
      }

      // NUEVO SALDO
      saldoPendiente -= capitalPagado;

      if (saldoPendiente < 0) {
        saldoPendiente = 0;
      }

      tabla.push({
        numcuota: i + 1,

        fechapago: fecha.toISOString().split("T")[0],

        fechavencimiento: addDays(fecha, prorrogaCuotas)
          .toISOString()
          .split("T")[0],

        montocuota: parseFloat((cuotaFija + seguroMonto).toFixed(2)),

        montocapital: parseFloat(capitalPagado.toFixed(2)),

        montointeres: parseFloat(interes.toFixed(2)),

        seguro: parseFloat(seguroMonto.toFixed(2)),

        saldoPendiente: parseFloat(saldoPendiente.toFixed(2)),

        estado: "normal",

        pagada: "false",
      });

      // SIGUIENTE SEMANA
      fecha = addDays(fecha, 7);
    }
  }

  return tabla;
};

export default getAmortizaData;
