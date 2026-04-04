import React, { useEffect, useState } from 'react';
import axios from 'axios'


const useGeClient = ( id ) => {
  const [DataCliente, setDataCliente] = useState([]);
  
  
  
  const getCliente = async (idcliente) => {
    try {
      const res = await axios.get(`http://localhost:5000/clientes/${idcliente}`);
      const Data = res?.data.data || res.data || []
      setDataCliente(Data);
      console.log(Data);
    } catch (error) {
      console.log(error);
    }
  };

   useEffect(()=>{
    getCliente(id)
  }, [id]);
  return {
    DataCliente,
  }
};

export default useGeClient;