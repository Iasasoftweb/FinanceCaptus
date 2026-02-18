import axios from "axios";


 export const Allzonas = async () => {
  const URI = "http://localhost:8000/zonas/";   
  const res = await axios.get(URI);
  const zonas = await res.data;

  return zonas;
};
