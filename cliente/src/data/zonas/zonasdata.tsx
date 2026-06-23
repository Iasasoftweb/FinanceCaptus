import axios from "axios";


 export const Allzonas = async () => {
  const URI = `${import.meta.env.VITE_API_URL}/zonas/`;   
  const res = await axios.get(URI);
  const zonas = await res.data;

  return zonas;
};
