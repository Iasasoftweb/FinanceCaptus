import React, { useState, useEffect } from "react";
import axios from "axios";

const useCompany = () => {
  const [dataCompany, setDataCompany] = useState([]);
  

  const CompanyData = async () => {
    try {
      const respuesta = await axios.get(`http://localhost:5000/Company/`)
       const Data = respuesta?.data.data || respuesta.data|| [];
        setDataCompany(Data);
        console.log(Data)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    CompanyData();
  }, []);

  return { dataCompany };
};

export default useCompany;
