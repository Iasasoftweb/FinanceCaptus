import React, { useState, useEffect } from "react";
import axios from "axios";

const useCobrador = () => {
  const [dataCobrador, setDataCobrador] = useState([]);

  const GetCobrador = async () => {
    const id = 2;
    try {
      const respuesta = await axios.get(`http://localhost:8000/usuarios/roles/${id}`);
        const Data = respuesta?.data.data || respuesta.data || []
          setDataCobrador(Data);
          console.log(Data);
        
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
      GetCobrador();
  }, [])

  return {
    dataCobrador,
  };
};

export default useCobrador;
