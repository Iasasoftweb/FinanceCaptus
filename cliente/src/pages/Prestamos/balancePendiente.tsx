import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, isBefore } from "date-fns";
import dayjs from "dayjs";
import { formatCurrency } from "../../components/UtilsStuff";

interface balanceForm {
  idprestemo: Number;
}

const useBalancePendiente = (idPrestamo) => {
  const [dataPrestamos, setDataPrestamos] = useState([]);
  const [dataCuotas, setDataCuotas] = useState([]);
  const [CuotasPendientes, setCuotasPendientes] = useState(0);
  const [BalancePendiente, setBalancePendiente] = useState(0);
  const [BalanceMoraPendiente, setBalanceMoraPendiente] = useState(0);
  const [BalanceCapitaPendiente, setBalanceCapitalPendiente] = useState(0);
  const [BalanceInteresPendiente, setBalanceInteresPendiente] = useState(0);
  const [CuotasAtrasadas, setCuotasAtrasadas] = useState(0);
  const [montoCuota, setMontoCuota] = useState(0);

  const uriPrestamos = "http://localhost:8000/prestamos/";
  const uriCuotas = "http://localhost:8000/cuotas/";

  const getPrestamos = async (idprestamo) => {
    try {
      const [PrestamoRes, CuotasRes] = await Promise.all([
        axios.get(`${uriPrestamos}${idprestamo}`),
        axios.get(`${uriCuotas}${idprestamo}`),
      ]);

      const CuotasData = CuotasRes?.data.data || CuotasRes.data;

      setDataPrestamos(PrestamoRes.data);
      setDataCuotas(CuotasData);
      setMontoCuota(CuotasData[0].montocuota);

      const hoy = dayjs();

      const pendientes = CuotasData.filter((item) => {
        const pagada =
          typeof item.pagada === "string"
            ? item.pagada.toLowerCase() === "true"
            : Boolean(item.pagada);

        const estaVencida = dayjs(item.fechapago).isAfter(hoy);

        return !pagada && estaVencida;
      });

      const Atrasos = CuotasData.filter((item) => {
        const pagada =
          typeof item.pagada === "string"
            ? item.pagada.toLowerCase() === "true" 
            : Boolean(item.pagada);

        const estaVencida = dayjs(item.fechavencimiento).isBefore(hoy);

        return !pagada && estaVencida;
      });

      setCuotasPendientes(pendientes.length);
      setCuotasAtrasadas(Atrasos.length);

      const totalPendiente = Atrasos.reduce(
        (sum, cuota) => sum + parseFloat(cuota.montopendiente || 0),
        0
      );

      const CapitalPendiente = Atrasos.reduce(
        (sum, cuota) =>
          sum +
          (parseFloat(cuota.montocapital) - parseFloat(cuota.capitalpagado) ||
            0),
        0
      );
      const InteresPendiente = Atrasos.reduce(
        (sum, cuota) =>
          sum +
          (parseFloat(cuota.montointeres) - parseFloat(cuota.interespagado) ||
            0),
        0
      );
      const totalMoraPendiente = Atrasos.reduce(
        (sum, cuota) =>
          sum + (parseFloat(cuota.mora) - parseFloat(cuota.morapagado) || 0),
        0
      );

      setBalanceMoraPendiente(totalMoraPendiente);
      setBalancePendiente(totalPendiente);
      setBalanceInteresPendiente(InteresPendiente);
      setBalanceCapitalPendiente(CapitalPendiente);

      console.log(formatCurrency(totalPendiente));
      console.log(pendientes.length);
      console.log(montoCuota);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (idPrestamo) {
      getPrestamos(idPrestamo);
      console.log(idPrestamo);
    }
  }, [idPrestamo]);

  return {
    CuotasPendientes,
    BalancePendiente,
    BalanceMoraPendiente,
    BalanceCapitaPendiente,
    BalanceInteresPendiente,
    CuotasAtrasadas,
    montoCuota,
  };
};

export default useBalancePendiente;
