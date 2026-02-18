import React, { useState, useEffect } from "react";
import axios from "axios";

const useTotalPrestamo = (idCliente: number) => {
  const [DataPrestamos, setDataPrestamos] = useState([]);
  const [TotalPrestamos, setTotalPrestamos] = useState(0);

  const uriPrestamos = "http://localhost:8000/prestamos/";

  const getPrestamos = async (id) => {
    try {
      const response = await axios.get(`${uriPrestamos}${id}`);
      const data = response?.data.data || response.data[0];
      setDataPrestamos(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const Total = setTotalPrestamos(DataPrestamos.length);
   
  useEffect(() => {
    getPrestamos(idCliente);
  }, [idCliente]);

  return {
    Total,
  };


};

export default useTotalPrestamo;
