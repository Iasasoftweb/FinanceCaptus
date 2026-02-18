import React, {useState, useEffect} from 'react';
import axios from 'axios';
interface props {
  id?: number;
}
const useDataPrestamos = (id) => {
  const UrisPrestamos = "http://localhost:8000/prestamos/";
  const [DataPrestamos, setDataPrestamos] = useState([]);
  
  const getPrestamos = async () => {
    try {
      const response = await axios.get(`${UrisPrestamos}`);
      const Data = response.data;
      setDataPrestamos(Data);
    
      
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(()=>{
    getPrestamos()
  },[])

  return {
     DataPrestamos,
  }
};

export default useDataPrestamos;