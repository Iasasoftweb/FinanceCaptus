import React, { useState, useEffect } from "react";
import axios from "axios";

const useDataUsuario = () => {
  const [dataUser, setDataUser] = useState([]);
  const getDataUsuario = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/usuarios/`).then((respuesta) => {
        setDataUser(respuesta.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{getDataUsuario()}, []);
  return {
    dataUser,
  };
};

export default useDataUsuario;
