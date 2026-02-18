import { useStepContext } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const CalculoMora = (idPrestamo) => {
  const [dataCuotas, setDataCuotas] = useState([]);
  const [dataVencido, setDataVencido] = useState([]);
  const [montoPago, setMontoPago]= useState(0);

  const UriData = "http://localhost:8000/cuotas/";

  const getCuotas = async (id) => {
    try {
      const response = await axios.get(`${UriData}${id}`);
      const Data = response?.data.data || response.data || [];
      setDataCuotas(Data);

      const cuotasVencidas =  Data.filter((items) => {
        const vencida = new Date(items.fechavencimiento) < new Date();
        return vencida;
      });
         
      setDataVencido(cuotasVencidas);
      setMontoPago(cuotasVencidas)

      console.log(cuotasVencidas)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (idPrestamo) {
      getCuotas(idPrestamo);
     
    }
  }, [idPrestamo]);

  return  null
  // {
  //   TTotalCuotas: dataCuotas.length,
  //   TCuotas: dataCuotas,
  //   DataVencido: dataVencido,
  // };
};

export default CalculoMora;
