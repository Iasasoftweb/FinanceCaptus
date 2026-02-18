import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { format } from "date-fns";

const useCuotasAtrasadas = (id) => {
  const [cuotas, setCuotas] = useState([]);
  const [cuotasAtrasadas, setCuotasAtrasadas] = useState(0);
  const [cuotasPendientes, setCuotasPendientes] = useState(0);

  const uriCuotas = "http://localhost:8000/cuotas/";

  const fetchCuotas = async () => {
    try {
      const respuesta = await axios.get(`${uriCuotas}${id}`);
      const cuotasData = respuesta.data.data;
      setCuotas(cuotasData);

      const hoy = format(new Date(), "MM-dd-yyyy");
      
      // Cuotas pendientes (no pagadas)
      const pendientes = cuotasData.filter(item => {
        const pagada = typeof item.pagada === 'string' 
          ? item.pagada.toLowerCase() === "true" 
          : Boolean(item.pagada);
        return !pagada;
      });
      
      setCuotasPendientes(pendientes.length);

      // Cuotas atrasadas (pendientes y con fecha de pago pasada)
      const atrasadas = pendientes.filter(item => {
        return format(item.fechapago, "MM/dd/yyyy") < hoy;
      });
      setCuotasAtrasadas(atrasadas.length);

    } catch (error) {
      console.error("Error fetching cuotas:", error);
    }
  };

  useEffect(() => {
    if (id) fetchCuotas();
  }, [id]);

  return {
    cuotasPendientes,
    cuotasAtrasadas,
    cuotas
  };
};

export default useCuotasAtrasadas;

