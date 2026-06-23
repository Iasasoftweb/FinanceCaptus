import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, isBefore } from "date-fns";
import dayjs from "dayjs";
import { formatCurrency } from "../../components/UtilsStuff";

const useBalancePendiente = (idprestamo: number) => {
  const [dataPrestamos, setDataPrestamos] = useState([]);
  const [dataCuotas, setDataCuotas] = useState([]);
  const [CuotasPendientes, setCuotasPendientes] = useState(0);
  const [BalancePendiente, setBalancePendiente] = useState(0);
  const [BalanceMoraPendiente, setBalanceMoraPendiente] = useState(0);
  const [BalanceCapitaPendiente, setBalanceCapitalPendiente] = useState(0);
  const [BalanceInteresPendiente, setBalanceInteresPendiente] = useState(0);
  const [CuotasAtrasadas, setCuotasAtrasadas] = useState(0);
  const [montoCuota, setMontoCuota] = useState(0);

  const uriPrestamos = `${import.meta.env.VITE_API_URL}/prestamos/`;
  const uriCuotas = `${import.meta.env.VITE_API_URL}/cuotas/`;

  const getPrestamos = async (idprestamo: number) => {
    try {
      const [PrestamoRes, CuotasRes] = await Promise.all([
        axios.get(`${uriPrestamos}${idprestamo}`),
        axios.get(`${uriCuotas}${idprestamo}`),
      ]);

      const CuotasData = CuotasRes?.data.data || CuotasRes.data;

      setDataPrestamos(PrestamoRes.data);
      setDataCuotas(CuotasData);
      setMontoCuota(CuotasData.length > 0 ? CuotasData[0].montocuota : 0);

      const hoy = dayjs();

      const pendientes = CuotasData.filter((item) => {
        const pagada =
          typeof item.pagada === "string"
            ? item.pagada.toLowerCase() === "true"
            : Boolean(item.pagada);

        return !pagada;
      });

      const Atrasos = CuotasData.filter((item) => {
        const pagada =
          typeof item.pagada === "string"
            ? item.pagada.toLowerCase() === "true"
            : Boolean(item.pagada);

        const estaVencida = dayjs(item.fechavencimiento)
          .endOf("day")
          .isBefore(hoy);

        return !pagada && estaVencida;
      });

      setCuotasPendientes(pendientes.length);
      setCuotasAtrasadas(Atrasos.length);

      const totalPendiente = CuotasData.reduce(
        (sum, cuota) =>
          sum +
          (parseFloat(cuota.montocapital) +
            parseFloat(cuota.montointeres || 0) +
            parseFloat(cuota.mora || 0) -
            (parseFloat(cuota.capitalpagado || 0) +
              parseFloat(cuota.interespagado || 0) +
              parseFloat(cuota.morapagado || 0)) || 0),
        0,
      );

      console.log(Math.round(totalPendiente));

      const CapitalPendiente = CuotasData.reduce(
        (sum, cuota) =>
          sum +
          (parseFloat(cuota.montocapital) -
            parseFloat(cuota.capitalpagado || 0) || 0),
        0,
      );

      const InteresPendiente = CuotasData.reduce(
        (sum, cuota) =>
          sum +
          (parseFloat(cuota.montointeres) - parseFloat(cuota.interespagado) ||
            0),
        0,
      );

      const totalMoraPendiente = Atrasos.reduce(
        (sum, cuota) =>
          sum + (parseFloat(cuota.mora) - parseFloat(cuota.morapagado) || 0),
        0,
      );

      setBalanceMoraPendiente(totalMoraPendiente);
      setBalancePendiente(Math.round(totalPendiente));
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
    if (idprestamo) {
      getPrestamos(idprestamo);
      console.log(idprestamo);
    }
  }, [idprestamo]);

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
