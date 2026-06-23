import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
interface props {
  iidprestamos?: number;
}

export const useDataPrestamos = () => {
  const UrisPrestamos = `${import.meta.env.VITE_API_URL}/prestamos/`;

  const [DataPrestamos, setDataPrestamos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPrestamos = async () => {
    try {
      setLoading(true);

      const response = await axios.get(UrisPrestamos);

      setDataPrestamos(response.data);
    } catch (err: any) {
      console.log(err);
      setError("Error al cargar los préstamos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPrestamos();
  }, []);

  return {
    DataPrestamos,
    loading,
    error,
    getPrestamos,
  };
};

export const usePrestamosOne = (idprestamos?: number) => {
  return useQuery({
    queryKey: ["prestamos", idprestamos],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/prestamos/${idprestamos}`,
      );
      return data;
    },
  });
};

export const useCuotasPrestamos = (idprestamos?: number) => {
  return useQuery({
    queryKey: ["cuotas", idprestamos],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/cuotas/${idprestamos}`,
      );
      return data.data || [];
    },

    enabled: !!idprestamos,
  });
};

export const usePrestamosCalculado = (prestamosLista, hoy = new Date()) => {
  return useMemo(() => {
    let sumaCapitalGlobal = 0;
    let sumaInteresGlobal = 0;


    const prestamosProcesados = (prestamosLista || []).map((prestamo) => {

       
      // Mapeo y cálculo detallado cuota por cuota
      const cuotasProcesadas = prestamo.cuotas.map((c) => {
        const montoTotalCuota = parseFloat(c.montocapital) + parseFloat(c.montointeres);
        const montoPagado = parseFloat(c.montopagado || 0);
        const saldoPendiente = Math.max(0, montoTotalCuota - montoPagado);
        
      

        // Una cuota está pagada/saldada si su saldo pendiente es insignificante (margen de decimales)
        const pagada = saldoPendiente <= 0.05;
        const esAbonada = montoPagado > 0 && !pagada;
        
        // Verificación de vencimiento
        const fechaVence = new Date(c.fechaVencimiento);
        const esVencida = !pagada && fechaVence < hoy;

        // Determinar etiqueta exacta de estado para la cuota
        let estadoCuota = 'PENDIENTE';
        if (pagada) {
          estadoCuota = 'PAGADA';
        } else if (esAbonada) {
          estadoCuota = esVencida ? 'ATRASADA (ABONADA)' : 'ABONADA';
        } else if (esVencida) {
          estadoCuota = 'ATRASADA';
        }

        return {
          ...c,
          montoTotalCuota,
          saldoPendiente,
          pagada,
          esAbonada,
          esVencida,
          estadoCuota
        };
      });



      // 1. Totales por préstamo
      const montoCapitalTotal = prestamo.cuotas.reduce((acc, c) => acc + parseFloat(c.montocapital), 0);
      const interesTotal = prestamo?.cuotas.reduce((acc, c) => acc + parseFloat(c.montointeres), 0);
      const saldoPendienteTotal = Math.round(cuotasProcesadas.reduce((acc, c) => acc + parseFloat(c.montopendiente), 0));
      
      
      sumaCapitalGlobal += montoCapitalTotal;
      sumaInteresGlobal += interesTotal;

      // 2. Control de cuotas (ej: 0 / 13)
      const cuotasTotales = prestamo.cuotas.length;
      const cuotasPagadas = prestamo.cuotas?.filter(c => c.pagada==='true').length;

      // 3. Cuotas atrasadas (No pagadas y fecha de vencimiento anterior a HOY)
      const cuotasAtrasadas = prestamo.cuotas?.filter(c => {
        const fechaVence = new Date(c.fechavencimiento);
        
        return c.pagada==='false'  && fechaVence < hoy;
      });    
      
      const estado = cuotasAtrasadas.length > 0 ? 'ATRASADO' : 'AL DÍA';
       
      return {
        ...prestamo,
        montoCapitalTotal,
        interesTotal,
        cuotasPagadas,
        cuotasTotales,
        saldoPendienteTotal,
        cantidadAtrasadas: cuotasAtrasadas.length,
        cuotasAtrasadasLista: cuotasAtrasadas,
        estado,
      };
    });
    
    return {
      prestamos: prestamosProcesados,
         totalesTabla: {
        capital: sumaCapitalGlobal,
        interes: sumaInteresGlobal,
      }
    };
  }, [prestamosLista, hoy]);
};


// export usePrestamosCalculado = (datosPrestamos)